import { sql } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, date, index, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	googleId: text('google_id').notNull().unique(),
	username: text('username').notNull().default('N/A'),
});
export type User = typeof users.$inferSelect;

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});
export type Session = typeof sessions.$inferSelect;

export const ProjectsTable = pgTable(
	'projects',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		description: text('description'),
		start: date('start', { mode: 'date' }).notNull().defaultNow(),
		end: date('end', { mode: 'date' }),
		media: text('media')
			.array()
			.notNull()
			.default(sql`array[]::text[]`),
		skills: text('skills')
			.array()
			.notNull()
			.default(sql`array[]::text[]`),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	},
	(table) => ({
		updatedAtIdx: index('projects_updated_at_idx').on(table.updatedAt),
	}),
);
export type Project = typeof ProjectsTable.$inferSelect;

export const AchievementsTable = pgTable(
	'achievements',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		projectId: text('project_id')
			.notNull()
			.references(() => ProjectsTable.id),
		summary: text('summary').notNull(),
		description: text('description'),
		private: text('private'),
		order: integer('order').notNull().default(0),
		media: text('media')
			.array()
			.notNull()
			.default(sql`array[]::text[]`),
		tags: text('tags')
			.array()
			.notNull()
			.default(sql`array[]::text[]`),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	},
	(table) => ({
		updatedAtIdx: index('achievements_updated_at_idx').on(table.updatedAt),
	}),
);
export type Achievement = typeof AchievementsTable.$inferSelect;

export const ApplicationsTable = pgTable(
	'applications',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		url: text('url').notNull().unique(), // unique URL slug for each application
		archived: boolean('archived').notNull().default(false),
		company: text('company').notNull(),
		introduction: text('introduction').notNull(),
		role: text('role').notNull(),
		highlightedAchievementIds: integer('highlighted_achievement_ids')
			.array()
			.notNull()
			.default(sql`array[]::integer[]`),
		highlightedComments: text('highlighted_comments')
			.array()
			.notNull()
			.default(sql`array[]::text[]`),
		defaultCategories: text('default_categories')
			.array()
			.notNull()
			.default(sql`array[]::text[]`),
		defaultScopes: text('default_scopes')
			.array()
			.notNull()
			.default(sql`array[]::text[]`),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	},
	(table) => ({
		urlIdx: index('applications_url_idx').on(table.url),
		updatedAtIdx: index('applications_updated_at_idx').on(table.updatedAt),
	}),
);
export type Application = typeof ApplicationsTable.$inferSelect;
