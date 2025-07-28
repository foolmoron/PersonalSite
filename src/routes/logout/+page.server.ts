import * as auth from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const ssr = false;

export const load = (async ({ locals, cookies }) => {
	if (!locals.session) {
		return;
	}
	await auth.invalidateSession(locals.session.id);
	auth.deleteSessionTokenCookie(cookies);
}) satisfies PageServerLoad;
