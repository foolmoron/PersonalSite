import { getProjectsByYear } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const years = await getProjectsByYear();
	return { years };
};
