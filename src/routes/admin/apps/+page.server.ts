import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { ApplicationsTable, AchievementsTable, ProjectsTable } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { Application } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const allApplications = await db
		.select()
		.from(ApplicationsTable)
		.orderBy(desc(ApplicationsTable.id));
	const allAchievements = await db
		.select()
		.from(AchievementsTable)
		.orderBy(AchievementsTable.order);
	const allProjects = await db.select().from(ProjectsTable);

	return {
		applications: allApplications,
		achievements: allAchievements,
		projects: allProjects,
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const url = form.get('url');
		const company = form.get('company');
		const role = form.get('role');
		const introduction = form.get('introduction');
		const highlightedAchievements = form.get('highlightedAchievements');
		const defaultCategories = form.get('defaultCategories');
		const defaultScopes = form.get('defaultScopes');

		if (typeof url !== 'string' || !url.trim()) {
			return fail(400, { error: 'URL slug is required' });
		}
		if (typeof company !== 'string' || !company.trim()) {
			return fail(400, { error: 'Company name is required' });
		}
		if (typeof role !== 'string' || !role.trim()) {
			return fail(400, { error: 'Role is required' });
		}
		if (typeof introduction !== 'string' || !introduction.trim()) {
			return fail(400, { error: 'Introduction is required' });
		}
		if (typeof highlightedAchievements !== 'string') {
			return fail(400, { error: 'Invalid form data: highlightedAchievements' });
		}
		if (typeof defaultCategories !== 'string') {
			return fail(400, { error: 'Invalid form data: defaultCategories' });
		}
		if (typeof defaultScopes !== 'string') {
			return fail(400, { error: 'Invalid form data: defaultScopes' });
		}

		// Parse the highlighted achievements JSON
		let achievementIdsArr: number[] = [];
		let achievementCommentsArr: string[] = [];

		try {
			const parsedAchievements = JSON.parse(highlightedAchievements);
			if (Array.isArray(parsedAchievements)) {
				achievementIdsArr = parsedAchievements
					.map((item: { id: number; comment: string }) => item.id)
					.filter((id: number) => typeof id === 'number');
				achievementCommentsArr = parsedAchievements.map(
					(item: { id: number; comment: string }) => item.comment || '',
				);
			}
		} catch (e) {
			// If parsing fails, fall back to empty arrays
			console.error('Failed to parse highlightedAchievements:', e);
		}

		const categoriesArr = defaultCategories
			.split(',')
			.map((cat) => cat.trim())
			.filter(Boolean);

		const scopesArr = defaultScopes
			.split(',')
			.map((scope) => scope.trim())
			.filter(Boolean);
		await db.insert(ApplicationsTable).values({
			url: url.trim(),
			company: company.trim(),
			role: role.trim(),
			introduction: introduction.trim(),
			highlightedAchievementIds: achievementIdsArr,
			highlightedComments: achievementCommentsArr,
			defaultCategories: categoriesArr as Application['defaultCategories'],
			defaultScopes: scopesArr as Application['defaultScopes'],
			updatedAt: new Date(),
		});

		return { success: true };
	},
	update: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');
		const url = form.get('url');
		const archived = form.get('archived');
		const company = form.get('company');
		const role = form.get('role');
		const introduction = form.get('introduction');
		const highlightedAchievements = form.get('highlightedAchievements');
		const defaultCategories = form.get('defaultCategories');
		const defaultScopes = form.get('defaultScopes');

		if (typeof id !== 'string' || !id.trim()) {
			return fail(400, { error: 'Application ID is required' });
		}
		const numericId = parseInt(id, 10);
		if (isNaN(numericId)) {
			return fail(400, { error: 'Invalid application ID' });
		}
		if (typeof url !== 'string' || !url.trim()) {
			return fail(400, { error: 'URL slug is required' });
		}
		if (typeof company !== 'string' || !company.trim()) {
			return fail(400, { error: 'Company name is required' });
		}
		if (typeof role !== 'string' || !role.trim()) {
			return fail(400, { error: 'Role is required' });
		}
		if (typeof introduction !== 'string' || !introduction.trim()) {
			return fail(400, { error: 'Introduction is required' });
		}
		if (typeof highlightedAchievements !== 'string') {
			return fail(400, { error: 'Invalid form data: highlightedAchievements' });
		}
		if (typeof defaultCategories !== 'string') {
			return fail(400, { error: 'Invalid form data: defaultCategories' });
		}
		if (typeof defaultScopes !== 'string') {
			return fail(400, { error: 'Invalid form data: defaultScopes' });
		}
		// Parse the highlighted achievements JSON
		let achievementIdsArr: number[] = [];
		let achievementCommentsArr: string[] = [];

		try {
			const parsedAchievements = JSON.parse(highlightedAchievements);
			if (Array.isArray(parsedAchievements)) {
				achievementIdsArr = parsedAchievements
					.map((item: { id: number; comment: string }) => item.id)
					.filter((id: number) => typeof id === 'number');
				achievementCommentsArr = parsedAchievements.map(
					(item: { id: number; comment: string }) => item.comment || '',
				);
			}
		} catch (e) {
			// If parsing fails, fall back to empty arrays
			console.error('Failed to parse highlightedAchievements:', e);
		}

		const categoriesArr = defaultCategories
			.split(',')
			.map((cat) => cat.trim())
			.filter(Boolean);

		const scopesArr = defaultScopes
			.split(',')
			.map((scope) => scope.trim())
			.filter(Boolean);
		await db
			.update(ApplicationsTable)
			.set({
				url: url.trim(),
				archived: archived === 'true',
				company: company.trim(),
				role: role.trim(),
				introduction: introduction.trim(),
				highlightedAchievementIds: achievementIdsArr,
				highlightedComments: achievementCommentsArr,
				defaultCategories: categoriesArr as Application['defaultCategories'],
				defaultScopes: scopesArr as Application['defaultScopes'],
				updatedAt: new Date(),
			})
			.where(eq(ApplicationsTable.id, numericId));

		return { success: true };
	},
	archive: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'Application ID is required' });
		}

		const numericId = parseInt(id, 10);
		if (isNaN(numericId)) {
			return fail(400, { error: 'Invalid application ID' });
		}

		await db
			.update(ApplicationsTable)
			.set({ archived: true, updatedAt: new Date() })
			.where(eq(ApplicationsTable.id, numericId));

		return { success: true };
	},
	delete: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'Application ID is required' });
		}

		const numericId = parseInt(id, 10);
		if (isNaN(numericId)) {
			return fail(400, { error: 'Invalid application ID' });
		}

		await db.delete(ApplicationsTable).where(eq(ApplicationsTable.id, numericId));

		return { success: true };
	},
};
