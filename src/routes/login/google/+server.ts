import { generateState, generateCodeVerifier } from 'arctic';
import {
	adminLandingPage,
	getGoogle,
	sessionCookieName,
	validateSessionToken,
} from '$lib/server/auth';

import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const sessionToken = event.cookies.get(sessionCookieName);
	if (sessionToken) {
		const { user } = await validateSessionToken(sessionToken);
		if (user) {
			throw redirect(302, adminLandingPage);
		}
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = getGoogle(event.url.origin).createAuthorizationURL(state, codeVerifier, [
		'openid',
		'profile',
	]);

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax',
	});
	event.cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax',
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}
