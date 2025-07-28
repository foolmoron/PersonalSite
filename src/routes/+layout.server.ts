import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load = (async (_event) => {
	return {};
}) satisfies LayoutServerLoad;
