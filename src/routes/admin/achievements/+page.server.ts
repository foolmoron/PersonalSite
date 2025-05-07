import { getProjectsByYear } from '$lib/server/projects';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Project } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const load: PageServerLoad = async () => {
	const years = await getProjectsByYear();
	return { years };
};

export const actions: Actions = {
	update: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');
		const name = form.get('name');
		const description = form.get('description');
		const start = form.get('start');
		const end = form.get('end');
		const skills = form.get('skills');
		if (typeof id !== 'string') {
			return { error: `Invalid form data: id` };
		}
		if (typeof name !== 'string') {
			return { error: `Invalid form data: name` };
		}
		if (typeof description !== 'string') {
			return { error: `Invalid form data: description` };
		}
		if (typeof start !== 'string') {
			return { error: `Invalid form data: start` };
		}
		if (typeof end !== 'string' && end !== null) {
			return { error: `Invalid form data: end` };
		}
		if (typeof skills !== 'string') {
			return { error: `Invalid form data: skills` };
		}
		const skillsArr = skills
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		await db
			.update(projects)
			.set({
				name,
				description,
				start: new Date(start),
				end: end ? new Date(end) : null,
				skills: skillsArr as Project['skills'],
			})
			.where(eq(projects.id, id));
		return { success: true };
	},
};
