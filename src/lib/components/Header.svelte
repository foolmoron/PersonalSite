<script lang="ts">
	import { CATEGORIES, SKILLS } from '$lib/enums';
	import { SvelteSet } from 'svelte/reactivity';
	import TagClickable from './TagClickable.svelte';
	import { skills, skillsActive, tags, tagsActive } from '$lib/state/skills.svelte';

	let {} = $props();

	const skillsScopeOnly = skills.filter((s) => SKILLS[s][1] == 'scope');

	function toggleSkill(skill: keyof typeof SKILLS) {
		if (skillsActive.has(skill)) {
			skillsActive.delete(skill);
		} else {
			skillsActive.add(skill);
		}
	}

	function enableAllScopes() {
		for (const s of skillsScopeOnly) {
			skillsActive.add(s);
		}
	}

	const categories = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
	const categoriesActive = $state<SvelteSet<keyof typeof CATEGORIES>>(new SvelteSet());

	function toggleCategory(category: keyof typeof CATEGORIES | null) {
		if (category === null) {
			categoriesActive.clear();
		} else if (categoriesActive.has(category)) {
			categoriesActive.delete(category);
		} else {
			categoriesActive.add(category);
		}
		for (const s of Array.from(skillsActive).filter((s) => SKILLS[s][1] != 'scope')) {
			skillsActive.delete(s);
		}
		tagsActive.clear();
		if (categoriesActive.size > 0) {
			for (const c of categoriesActive) {
				for (const skill of CATEGORIES[c].skills) {
					skillsActive.add(skill);
				}
				for (const tag of CATEGORIES[c].tags) {
					tagsActive.add(tag);
				}
			}
		} else {
			for (const s of skills) {
				skillsActive.add(s);
			}
			for (const t of tags) {
				tagsActive.add(t);
			}
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
	<p>Hi, welcome to my resume builder.</p>
	<p>Choose the categories of my work you're interested in:</p>
	<div class="not-prose flex flex-wrap gap-[0.2rem] px-[0.2rem]">
		<TagClickable
			category={null}
			style={categoriesActive.size == 0 ? 'active' : 'inactive'}
			onclick={() => toggleCategory(null)}
		></TagClickable>
		{#each categories as category}
			<TagClickable
				{category}
				style={categoriesActive.size > 0 && categoriesActive.has(category) ? 'active' : 'inactive'}
				onclick={() => toggleCategory(category)}
			></TagClickable>
		{/each}
	</div>
	<p>And toggle the scopes of work you're interested in:</p>
	<div class="not-prose flex flex-wrap gap-[0.2rem] px-[0.2rem]">
		<TagClickable
			category={null}
			style={skillsScopeOnly.every((s) => skillsActive.has(s)) ? 'active' : 'inactive'}
			onclick={() => enableAllScopes()}
		></TagClickable>
		{#each skills.filter((s) => SKILLS[s][1] == 'scope') as skill}
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
