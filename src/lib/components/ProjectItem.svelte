<script lang="ts">
	import Tag from './Tag.svelte';
	import AchievementItem from '$lib/components/AchievementItem.svelte';
	import { type Achievement, type Project } from '$lib/server/db/schema';

	interface Props {
		project: Project & { achievements: Achievement[] };
		open: boolean;
	}

	const { project }: Props = $props();
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
			{#each project.skills as skill}
				<Tag {skill}></Tag>
			{/each}
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
		margin-bottom: 1rem;
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
</style>
