import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ApplicationsTable } from '$lib/server/db/schema';
import { getProjectsByYear } from '$lib/server/projects';
import type { EntryGenerator, PageServerLoad } from './$types';
import { REDIRECTS } from '$lib/server/redirects';

export const load: PageServerLoad = async ({ params }) => {
	const url = params.url.toLowerCase();

	// Redirect if the URL matches a known redirect
	if (REDIRECTS[url]) {
		throw redirect(302, REDIRECTS[url]);
	}

	// Look up the application by URL
	const application = await db.query.ApplicationsTable.findFirst({
		where: eq(ApplicationsTable.url, url),
	});

	// Return 404 if no matching application found
	if (!application || application.archived) {
		error(404, 'Application not found');
	}

	// Load projects data for ProjectList
	const years = await getProjectsByYear();

	return {
		application,
		years,
	};
};

export const entries: EntryGenerator = async () => {
	const applications = await db.query.ApplicationsTable.findMany();
	return applications
		.filter(item => !item.archived)
		.map(({ url }) => ({ url }))
		.concat(Object.keys(REDIRECTS).map((url) => ({ url })));
};
