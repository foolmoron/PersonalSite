import { getProjectsByYear } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const years = await getProjectsByYear();
	return { id: event.params.id, years };
}) satisfies PageServerLoad;
