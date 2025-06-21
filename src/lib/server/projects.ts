import { db } from '$lib/server/db';
import { AchievementsTable, type Achievement, type Project } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export interface ProjectsYear {
	year: number;
	projects: (Project & { achievements: Achievement[] })[];
}

export async function getProjectsByYear() {
	const [achievements, projects] = await Promise.all([
		db.query.AchievementsTable.findMany({
			orderBy: [asc(AchievementsTable.order)],
		}),
		db.query.ProjectsTable.findMany(),
	]);

	const projs = projects.map((p) => ({
		...p,
		achievements: achievements.filter((a) => a.projectId === p.id),
	}));
	const yearMap: Map<number, typeof projs> = new Map();
	const thisYear = new Date().getFullYear();
	for (const p of projs) {
		const y = p.end?.getFullYear() ?? thisYear;
		if (!yearMap.has(y)) {
			yearMap.set(y, []);
		}
		yearMap.get(y)!.push(p);
	}

	const years: ProjectsYear[] = [];
	for (const y of Array.from(yearMap.keys()).toSorted((a, b) => b - a)) {
		years.push({
			year: y,
			projects: yearMap.get(y)!,
		});
	}

	return years;
}
