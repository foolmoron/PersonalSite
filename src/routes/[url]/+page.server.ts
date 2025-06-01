import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { applications } from '$lib/server/db/schema';
import { getProjectsByYear } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { url } = params;

	// Look up the application by URL
	const application = await db.query.applications.findFirst({
		where: eq(applications.url, url),
	});

	// Return 404 if no matching application found
	if (!application) {
		error(404, 'Application not found');
	}

	// Load projects data for ProjectList
	const years = await getProjectsByYear();

	return {
		application,
		years,
	};
};
