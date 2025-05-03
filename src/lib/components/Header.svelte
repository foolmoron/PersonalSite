<script lang="ts">
	import { CATEGORIES, SKILLS, TAGS } from '$lib/enums';
	import { SvelteSet } from 'svelte/reactivity';
	import TagClickable from './TagClickable.svelte';

	let {} = $props();

	const skills = Object.keys(SKILLS) as (keyof typeof SKILLS)[];
	const skillsActive = $state(new SvelteSet(skills));
	let skillsCustomized = $state(false);

	function toggleSkill(skill: keyof typeof SKILLS) {
		skillsCustomized = true;
		if (skillsActive.has(skill)) {
			skillsActive.delete(skill);
		} else {
			skillsActive.add(skill);
		}
	}

	const categories = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
	let categoryActive = $state<keyof typeof CATEGORIES | null>(null);

	function chooseCategory(category: keyof typeof CATEGORIES | null) {
		categoryActive = category;
		skillsActive.clear();
		skillsCustomized = false;
		const skillsToAdd = category === null ? skills : CATEGORIES[category].skills;
		for (const skill of skillsToAdd) {
			skillsActive.add(skill);
		}
	}
</script>

<header class="prose max-w-6xl">
	<h1>Momin Khan</h1>
	<h2>Game Developer and Software Engineer</h2>
	<ul>
		<li>linkedin</li>
		<li>github</li>
		<li>email</li>
	</ul>
	<p>Hi, welcome to my resume builder. Click on the category of my work you are interested in:</p>
	<div class="not-prose flex flex-wrap gap-[0.2rem] px-[0.2rem]">
		<TagClickable
			category={null}
			style={!skillsCustomized && categoryActive == null ? 'active' : 'inactive'}
			onclick={() => chooseCategory(null)}
		></TagClickable>
		{#each categories as category}
			<TagClickable
				{category}
				style={!skillsCustomized && categoryActive == category ? 'active' : 'inactive'}
				onclick={() => chooseCategory(category)}
			></TagClickable>
		{/each}
	</div>
	<p>Or toggle the tags you're interested in directly:</p>
	<div class="not-prose flex flex-wrap gap-[0.2rem] px-[0.2rem]">
		{#each skills as skill}
			<TagClickable
				{skill}
				style={skillsActive.has(skill) ? 'active' : 'inactive'}
				onclick={() => toggleSkill(skill)}
			></TagClickable>
		{/each}
	</div>
	<br />
</header>

<style>
</style>
