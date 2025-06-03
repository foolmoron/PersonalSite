import { GOOGLE_SELF_ID } from '$env/static/private';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { getGoogle } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';

import type { RequestEvent } from '@sveltejs/kit';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { eq } from 'drizzle-orm';

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await getGoogle(event.url.origin).validateAuthorizationCode(code, codeVerifier);
	} catch (_e: unknown) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}
	const claims = decodeIdToken(tokens.idToken()) as {
		sub: string;
		name: string;
	};
	const googleId = claims.sub;
	const username = claims.name;

	// Only allow your own google account to login
	if (googleId !== GOOGLE_SELF_ID) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	}

	const existingUser = await db.query.users.findFirst({
		where: eq(users.googleId, googleId),
	});

	if (existingUser != null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	}

	const id = generateUserId();
	const user = (
		await db
			.insert(users)
			.values({
				id,
				googleId,
				username,
			})
			.returning()
	)[0];

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
		},
	});
}
