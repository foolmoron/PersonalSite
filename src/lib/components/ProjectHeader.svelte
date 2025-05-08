<script lang="ts">
	import Tag from './Tag.svelte';
	import { type Project } from '$lib/server/db/schema';
	import { skills, skillsActive } from '$lib/state/skills.svelte';
	import { SKILLS } from '$lib/enums';

	interface Props {
		project: Project;
		infoOnly?: boolean;
	}

	const { project, infoOnly = false }: Props = $props();

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

<header class="project-header">
	<h1>
		<a
			href={`#${project.id}`}
			class="project-link"
			onclick={() => {
				document.querySelectorAll('[popover]').forEach((p) => (p as HTMLElement).hidePopover());
			}}
		>
			{project.name}
		</a>
		<span class="years">
			{project.start.toLocaleDateString('en-US', {
				month: 'short',
				year: 'numeric',
			})} - {project.end?.toLocaleDateString('en-US', {
				month: 'short',
				year: 'numeric',
			}) ?? 'Present'}
		</span>
	</h1>
	<h2>
		{project.description}
	</h2>
	{#if !infoOnly}
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
	{/if}
</header>

<style>
	.years {
		font-style: italic;
		font-weight: 400;
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
	a.project-link:hover {
		text-decoration: underline;
	}
	.skills-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem;
		padding: 0.2rem 0;
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
