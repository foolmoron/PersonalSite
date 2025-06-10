import { getProjectsByYear } from '$lib/server/projects';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, achievements } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Project, Achievement } from '$lib/server/db/schema';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

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
		const media = form.get('media');
		if (typeof id !== 'string') {
			return fail(400, { error: `Invalid form data: id` });
		}
		if (typeof name !== 'string') {
			return fail(400, { error: `Invalid form data: name` });
		}
		if (typeof description !== 'string') {
			return fail(400, { error: `Invalid form data: description` });
		}
		if (typeof start !== 'string') {
			return fail(400, { error: `Invalid form data: start` });
		}
		if (typeof end !== 'string' && end !== null) {
			return fail(400, { error: `Invalid form data: end` });
		}
		if (typeof skills !== 'string') {
			return fail(400, { error: `Invalid form data: skills` });
		}
		if (typeof media !== 'string') {
			return fail(400, { error: `Invalid form data: media` });
		}
		const skillsArr = skills
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const mediaArr = media
			.split('\n')
			.map((m) => m.trim())
			.filter(Boolean);
		await db
			.update(projects)
			.set({
				name,
				description,
				start: new Date(start),
				end: end ? new Date(end) : null,
				skills: skillsArr as Project['skills'],
				media: mediaArr,
			})
			.where(eq(projects.id, id));
		return { success: true };
	},

	create: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');
		const name = form.get('name');
		const description = form.get('description');
		const start = form.get('start');
		const end = form.get('end');
		const skills = form.get('skills');
		const media = form.get('media');

		if (typeof id !== 'string' || !id.trim()) {
			return fail(400, { error: 'Project ID is required' });
		}
		if (typeof name !== 'string' || !name.trim()) {
			return fail(400, { error: 'Project name is required' });
		}
		if (typeof description !== 'string') {
			return fail(400, { error: 'Invalid form data: description' });
		}
		if (typeof start !== 'string' || !start) {
			return fail(400, { error: 'Start date is required' });
		}
		if (typeof skills !== 'string') {
			return fail(400, { error: 'Invalid form data: skills' });
		}
		if (typeof media !== 'string') {
			return fail(400, { error: 'Invalid form data: media' });
		}

		const skillsArr = skills
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const mediaArr = media
			.split('\n')
			.map((m) => m.trim())
			.filter(Boolean);

		await db.insert(projects).values({
			id: id.trim(),
			name: name.trim(),
			description: description.trim() || null,
			start: new Date(start),
			end: end && typeof end === 'string' ? new Date(end) : null,
			skills: skillsArr as Project['skills'],
			media: mediaArr,
		});

		return { success: true, projectId: id };
	},

	// Achievement actions
	updateAchievement: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');
		const projectId = form.get('projectId');
		const summary = form.get('summary');
		const description = form.get('description');
		const privateValue = form.get('private');
		const tags = form.get('tags');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'Achievement ID is required' });
		}
		if (!projectId || typeof projectId !== 'string') {
			return fail(400, { error: 'Project ID is required' });
		}
		if (!summary || typeof summary !== 'string') {
			return fail(400, { error: 'Summary is required' });
		}
		if (typeof description !== 'string') {
			return fail(400, { error: 'Invalid form data: description' });
		}
		if (typeof privateValue !== 'string') {
			return fail(400, { error: 'Invalid form data: private' });
		}
		if (typeof tags !== 'string') {
			return fail(400, { error: 'Invalid form data: tags' });
		}

		const tagsArr = tags
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		await db
			.update(achievements)
			.set({
				summary: summary.trim().replace(/\.+$/, '') + '.', // Ensure summary ends with a period
				description: description.trim() || null,
				private: privateValue,
				tags: tagsArr as Achievement['tags'],
			})
			.where(eq(achievements.id, parseInt(id)));

		return { success: true };
	},

	createAchievement: async ({ request }) => {
		const form = await request.formData();
		const projectId = form.get('projectId');
		const summary = form.get('summary');
		const description = form.get('description');
		const privateValue = form.get('private');
		const tags = form.get('tags');

		if (!projectId || typeof projectId !== 'string') {
			return fail(400, { error: 'Project ID is required' });
		}
		if (!summary || typeof summary !== 'string') {
			return fail(400, { error: 'Summary is required' });
		}
		if (typeof description !== 'string') {
			return fail(400, { error: 'Invalid form data: description' });
		}
		if (typeof privateValue !== 'string') {
			return fail(400, { error: 'Invalid form data: private' });
		}
		if (typeof tags !== 'string') {
			return fail(400, { error: 'Invalid form data: tags' });
		}

		const tagsArr = tags
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		await db.insert(achievements).values({
			projectId,
			summary: summary.trim().replace(/\.+$/, '') + '.', // Ensure summary ends with a period
			description: description.trim() || null,
			private: privateValue,
			tags: tagsArr as Achievement['tags'],
		});

		return { success: true };
	},

	archiveAchievement: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'Achievement ID is required' });
		}

		// For now, this is a placeholder action that doesn't do anything
		// In the future, you could add an 'archived' field to the achievements table
		// and set it to true here

		return { success: true };
	},
};
