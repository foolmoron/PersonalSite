import { SKILLS, TAGS } from '../../enums';
import { sql } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, pgEnum, date } from 'drizzle-orm/pg-core';

const skillsTuple = Object.keys(SKILLS) as [keyof typeof SKILLS];
export const skillsEnum = pgEnum('skills', skillsTuple);

const tagsTuple = Object.keys(TAGS) as [keyof typeof TAGS];
export const tagsEnum = pgEnum('tags', tagsTuple);

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

export const projects = pgTable('projects', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	start: date('start', { mode: 'date' }).notNull().defaultNow(),
	end: date('end', { mode: 'date' }),
	media: text('media')
		.array()
		.notNull()
		.default(sql`array[]::text[]`),
	skills: skillsEnum('skills')
		.array()
		.notNull()
		.default(sql.raw(`array${JSON.stringify(skillsTuple).replaceAll('"', "'")}::skills[]`)),
});
export type Project = typeof projects.$inferSelect;

export const achievements = pgTable('achievements', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	projectId: text('project_id')
		.notNull()
		.references(() => projects.id),
	summary: text('summary').notNull(),
	description: text('description'),
	private: text('private'),
	media: text('media')
		.array()
		.notNull()
		.default(sql`array[]::text[]`),
	tags: tagsEnum('tags')
		.array()
		.notNull()
		.default(sql.raw(`array${JSON.stringify(tagsTuple).replaceAll('"', "'")}::tags[]`)),
});
export type Achievement = typeof achievements.$inferSelect;
