import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load = (async (event) => {
	return { user: event.locals.user ?? undefined };
}) satisfies LayoutServerLoad;
