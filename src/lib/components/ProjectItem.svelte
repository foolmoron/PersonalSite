<script lang="ts">
	import Tag from './Tag.svelte';

	import AchievementItem from '$lib/components/AchievementItem.svelte';
	import { SKILLS } from '$lib/enums';
	import { type Achievement, type Project } from '$lib/server/db/schema';

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
			{project.name}
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
	</summary>

	{#each project.achievements as achievement}
		<AchievementItem {achievement}></AchievementItem>
	{/each}
</details>

<style>
	.years {
		font-style: italic;
		font-weight: 400;
	}
	details {
		padding: 0.6rem;
		background-color: white;
		transition:
			0.32s padding ease-out,
			0.32s background ease-out;
	}
	summary {
		padding: 0.2rem 0.4rem;
		list-style-type: none;
		cursor: pointer;
		background-color: white;
		/* border-radius: 4px; */
		transition:
			0.32s padding ease-out,
			0.32s background ease-out,
			0.32s box-shadow ease-out;
	}
	details:is([open], :hover) {
		background-color: transparent;
	}
	details:is([open], :hover) summary {
		box-shadow: 1px 1px 1px 1px #000000f0;
	}
	details[open] summary {
		margin-bottom: 0.4rem;
	}
	summary h1 {
		font-weight: bold;
		font-size: 1.2rem;
	}
	.skills-container {
		display: flex;
		gap: 0.2rem;
		padding: 0.2rem 0;
	}
</style>
