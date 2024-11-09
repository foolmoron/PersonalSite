import { SKILLS, TAGS } from '../../enums';
import { sql } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

const skillsTuple = Object.keys(SKILLS) as [keyof typeof SKILLS];
export const skillsEnum = pgEnum('skills', skillsTuple);

const tagsTuple = Object.keys(TAGS) as [keyof typeof TAGS];
export const tagsEnum = pgEnum('tags', tagsTuple);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
});
export type User = typeof user.$inferSelect;

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});
export type Session = typeof session.$inferSelect;

export const project = pgTable('project', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	media: text('media')
		.array()
		.notNull()
		.default(sql`array[]::text[]`),
	skills: skillsEnum('skills')
		.array()
		.notNull()
		.default(sql.raw(`array${JSON.stringify(skillsTuple).replaceAll('"', "'")}::skills[]`)),
});
export type Project = typeof project.$inferSelect;

export const achievement = pgTable('achievement', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	projectId: text('project_id')
		.notNull()
		.references(() => project.id),
	summary: text('summary').notNull(),
	description: text('description').default(''),
	private: text('private').default(''),
	media: text('media')
		.array()
		.notNull()
		.default(sql`array[]::text[]`),
	tags: tagsEnum('tags')
		.array()
		.notNull()
		.default(sql.raw(`array${JSON.stringify(tagsTuple).replaceAll('"', "'")}::tags[]`)),
});
export type Achievement = typeof achievement.$inferSelect;
