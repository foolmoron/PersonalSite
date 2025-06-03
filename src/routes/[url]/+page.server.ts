import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { applications } from '$lib/server/db/schema';
import { getProjectsByYear } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

const REDIRECTS = {
	typescript:
		'https://docs.google.com/presentation/d/e/2PACX-1vTtZRg7lm4UtcSSmP0GEvXSDA-A6saHTLDhGan9gM1-GgsDjnETq8QePXf9nCdAUKWD0knPKTkLOVvW/pub?start=false&loop=false&delayms=3000',
	webgames:
		'https://docs.google.com/presentation/d/e/2PACX-1vT3QSOHEohNyswK7q5kMg7WC2ucfhRyStj3xul2aNolxfv8ajdMP3Onix80_5ISzQjh3apvh1by7X15/pub?start=false&loop=false&delayms=60000',
} as Record<string, string | undefined>;

export const load: PageServerLoad = async ({ params }) => {
	const url = params.url.toLowerCase();

	// Redirect if the URL matches a known redirect
	if (REDIRECTS[url]) {
		throw redirect(302, REDIRECTS[url]);
	}

	// Look up the application by URL
	const application = await db.query.applications.findFirst({
		where: eq(applications.url, url),
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
