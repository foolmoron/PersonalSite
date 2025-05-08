<script lang="ts">
	import ProjectItem from '$lib/components/ProjectItem.svelte';
	import type { PageServerData } from './$types';
	import { skillsActive } from '$lib/state/skills.svelte';
	import type { Project, Achievement } from '$lib/server/db/schema';
	import { SKILLS } from '$lib/enums';
	import Header from '$lib/components/Header.svelte';

	let { data }: { data: PageServerData } = $props();

	// Function to check if a project has any active skills
	function hasActiveSkills(project: Project & { achievements: Achievement[] }): boolean {
		const hasAnyActiveSkill = project.skills.some(
			(skill) => SKILLS[skill][1] != 'scope' && skillsActive.has(skill as keyof typeof SKILLS),
		);
		const hasInactiveScope = project.skills.some(
			(skill) => SKILLS[skill][1] == 'scope' && !skillsActive.has(skill as keyof typeof SKILLS),
		);
		return hasAnyActiveSkill && !hasInactiveScope;
	}

	// Separate projects with active skills from those without
	const yearsSorted = $derived(
		data.years.map(({ year, projects }) => {
			const activeProjects = projects.filter((project) => hasActiveSkills(project));
			const inactiveProjects = projects.filter((project) => !hasActiveSkills(project));
			return { year, activeProjects, inactiveProjects };
		}),
	);

	// Count total inactive projects across all years
	const totalInactiveProjects = $derived(
		yearsSorted.reduce((total, { inactiveProjects }) => total + inactiveProjects.length, 0),
	);

	// Collect all achievements across all projects for similarity comparison
	const allAchievements: Achievement[] = $derived(
		data.years.flatMap((year) => year.projects.flatMap((project) => project.achievements)),
	);
</script>

<Header></Header>

{#each yearsSorted as { year, activeProjects }}
	{#each activeProjects as project}
		<ProjectItem {project} open={false} {allAchievements}></ProjectItem>
	{/each}
{/each}

{#if totalInactiveProjects > 0}
	<details class="other-projects">
		<summary class="other-projects-summary">Other Projects ({totalInactiveProjects})</summary>
		{#each yearsSorted as { year, inactiveProjects }}
			{#each inactiveProjects as project}
				<ProjectItem {project} open={false} {allAchievements}></ProjectItem>
			{/each}
		{/each}
	</details>
{/if}

<style>
	.other-projects-summary {
		font-size: 1.1rem;
		font-weight: 600;
		padding: 0.5rem;
		cursor: pointer;
	}

	.other-projects-summary:hover {
		text-decoration: underline;
	}
</style>
