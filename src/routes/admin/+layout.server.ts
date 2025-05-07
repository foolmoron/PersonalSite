import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { sessionCookieName, validateSessionToken } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get(sessionCookieName);

	if (!sessionToken) {
		// No session token, redirect to home page
		throw redirect(302, '/');
	}

	const { user } = await validateSessionToken(sessionToken);

	if (!user) {
		// Invalid or expired session, redirect to home page
		throw redirect(302, '/');
	}

	return {
		user,
	};
};
