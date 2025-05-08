<script lang="ts">
	import ProjectHeader from './ProjectHeader.svelte';
	import AchievementItem from '$lib/components/AchievementItem.svelte';
	import { type Achievement, type Project } from '$lib/server/db/schema';
	import { tagsActive } from '$lib/state/skills.svelte';
	import { TAGS } from '$lib/enums';
	import { onMount } from 'svelte';

	interface Props {
		project: Project & { achievements: Achievement[] };
		open: boolean;
		allAchievements?: Achievement[];
	}

	const { project, allAchievements = [] }: Props = $props();

	const TAGS_ALWAYS_SHOW = new Set<keyof typeof TAGS>(['general']);
	const TAGS_DEFAULT_HIDE = new Set<keyof typeof TAGS>(['subtle']);
	const achievementsAll = project.achievements.toSorted((a, b) => a.id - b.id);
	const achievementsVisible = $derived(
		achievementsAll.filter(
			(a) =>
				!a.tags.some((t) => TAGS_DEFAULT_HIDE.has(t)) &&
				a.tags.some((t) => TAGS_ALWAYS_SHOW.has(t) || tagsActive.has(t)),
		),
	);
	const achievementsHidden = $derived(
		achievementsAll.filter(
			(a) => a.tags.some((t) => TAGS_DEFAULT_HIDE.has(t)) || !a.tags.some((t) => tagsActive.has(t)),
		),
	);
</script>

<article class="project-item" id={project.id}>
	<ProjectHeader {project} />

	<section class="achievements">
		{#each achievementsVisible as achievement}
			<AchievementItem {achievement} {project} {allAchievements}></AchievementItem>
		{/each}

		{#if achievementsHidden.length > 0}
			<details class="hidden-achievements">
				<summary class="hidden-achievements-summary">
					Show {achievementsHidden.length} more achievement{achievementsHidden.length !== 1
						? 's'
						: ''}
				</summary>
				{#each achievementsHidden as achievement}
					<AchievementItem {achievement} {project} {allAchievements}></AchievementItem>
				{/each}
			</details>
		{/if}
	</section>
</article>

<style>
	.project-item {
		background-color: white;
		scroll-margin-top: 2rem;
		max-width: 72rem;
		margin-bottom: 1rem;
	}
	.achievements {
		padding: 0.2rem 0.4rem;
	}
	.hidden-achievements-summary {
		margin-left: 0.6rem;
		cursor: pointer;
		font-style: italic;
	}
	.hidden-achievements-summary:hover {
		text-decoration: underline;
	}
	.hidden-achievements-summary::marker {
		list-style-type: disc;
	}
</style>
