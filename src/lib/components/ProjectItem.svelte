<script lang="ts">
	import Tag from './Tag.svelte';
	import AchievementItem from '$lib/components/AchievementItem.svelte';
	import { type Achievement, type Project } from '$lib/server/db/schema';
	import { skills, skillsActive } from '$lib/state/skills.svelte';
	import { SKILLS } from '$lib/enums';

	interface Props {
		project: Project & { achievements: Achievement[] };
		open: boolean;
	}

	const { project }: Props = $props();

	// Use $derived to recalculate these whenever skillsActive changes
	const skillsVisible = $derived(
		skills.filter(
			(s) => (skillsActive.has(s) || SKILLS[s][1] == 'scope') && project.skills.includes(s),
		),
	);
	const skillsHidden = $derived(
		skills.filter(
			(s) => !(skillsActive.has(s) || SKILLS[s][1] == 'scope') && project.skills.includes(s),
		),
	);
	let showHiddenSkills = $state(false);
</script>

<article class="project-item" id={project.id}>
	<header class="project-header">
		<h1>
			<a href={`#${project.id}`} class="project-link">
				{project.name}
			</a>
			<span class="years">
				{project.start.getFullYear()} - {project.end?.getFullYear() ?? 'Present'}
			</span>
		</h1>
		<h2>
			{project.description}
		</h2>
		<div class="skills-container hide-when-empty">
			{#each skillsVisible as skill}
				<Tag {skill}></Tag>
			{/each}

			{#if skillsHidden.length > 0}
				{#if showHiddenSkills}
					{#each skillsHidden as skill}
						<Tag {skill}></Tag>
					{/each}
				{:else}
					<button
						class="hidden-skills-button"
						onclick={() => {
							showHiddenSkills = true;
						}}
					>
						Show {skillsHidden.length} other skill{skillsHidden.length !== 1 ? 's' : ''}...
					</button>
				{/if}
			{/if}
		</div>
	</header>

	<section class="achievements">
		{#each project.achievements as achievement}
			<AchievementItem {achievement}></AchievementItem>
		{/each}
	</section>
</article>

<style>
	.years {
		font-style: italic;
		font-weight: 400;
	}
	.project-item {
		padding: 0.6rem;
		background-color: white;
		scroll-margin-top: 2rem;
	}
	.project-header {
		padding: 0.2rem 0.4rem;
		background-color: white;
		margin-bottom: 0.4rem;
	}
	h1 {
		font-weight: bold;
		font-size: 1.2rem;
	}
	.project-link {
		color: inherit;
		text-decoration: none;
	}
	.project-link:hover {
		text-decoration: underline;
	}
	.skills-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem;
		padding: 0.2rem 0;
	}
	.achievements {
		padding: 0.2rem 0.4rem;
	}
	.hidden-skills-button {
		font-size: 0.8rem;
		border: none;
		cursor: pointer;
		color: #333;
		font-style: italic;
	}
	.hidden-skills-button:hover {
		text-decoration: underline;
	}
</style>
