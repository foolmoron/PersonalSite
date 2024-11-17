<script lang="ts">
	import AchievementItem from '$lib/components/AchievementItem.svelte';
	import type { Achievement, Project } from '$lib/server/db/schema';

	let { project }: { project: Project & { achievements: Achievement[] } } = $props();

	function toggle(evt: Event) {
		if (!(evt.currentTarget as HTMLDetailsElement).open) {
			return;
		}
		for (const d of document.querySelectorAll('details')) {
			if (d === evt.currentTarget) {
				continue;
			}
			d.open = false;
		}
	}
</script>

<details ontoggle={toggle}>
	<summary>
		<h1>
			{project.name} [{project.start.getFullYear()} - {project.end?.getFullYear() ?? 'Present'}]
		</h1>
		<h2>
			{project.description}
		</h2>
	</summary>

	{#each project.achievements as achievement}
		<AchievementItem {achievement}></AchievementItem>
	{/each}
</details>

<style>
	details {
		padding: 0.6rem 1rem;
		background: none;
		background-color: white;
	}
	summary {
		list-style-type: none;
		cursor: pointer;
		background-color: white;
	}
	details[open] {
		padding: 0.4rem;
		background: none;
	}
	details[open] summary {
		margin-bottom: 0.5rem;
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		box-shadow: 1px 1px 1px 1px #000000f0;
	}
	summary h1 {
		font-weight: bold;
		font-size: 1.2rem;
	}
</style>
