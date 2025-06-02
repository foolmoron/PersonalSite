<script lang="ts">
	import { SKILLS } from '$lib/enums';
	import TagClickable from './TagClickable.svelte';
	import {
		categories,
		categoriesActive,
		enableAllScopes,
		skills,
		skillsActive,
		skillsScopeOnly,
		toggleCategory,
		toggleSkill,
	} from '$lib/state/skills.svelte';
	import { goto } from '$app/navigation';

	let {} = $props();

	// Click counter variables
	const REQUIRED_CLICKS = 5;
	const TIME_WINDOW_MS = 3000;

	let clickCount = 0;
	let firstClickTime = 0;

	function handleHeaderClick() {
		const now = Date.now();

		// Reset counter if this is first click or if the time window expired
		if (clickCount === 0 || now - firstClickTime > TIME_WINDOW_MS) {
			clickCount = 1;
			firstClickTime = now;
		} else {
			clickCount++;

			// Redirect if we've reached the required clicks within the time window
			if (clickCount >= REQUIRED_CLICKS) {
				goto('/login/google');
				clickCount = 0;
			}
		}
	}
</script>

<header class="max-w-6xl">
	<p class="my-4">
		Hi, welcome to my interactive resume builder! I had this idea after spending too much time
		tailoring my resume for dozens of jobs across 3 different industries. Here you can see my work
		at a high level, and dig into particular projects and achievements that interest you. (If you're
		a nerd, check out the <a href="https://github.com/foolmoron/PersonalSite">source code here!</a>)
	</p>
	<p class="my-2">First, toggle the categories of my work you're interested in:</p>
	<div class="flex flex-wrap gap-[0.2rem] px-[0.2rem]">
		<TagClickable
			category={null}
			style={categories.every((c) => categoriesActive.has(c)) ? 'active' : 'inactive'}
			big
			onclick={() => toggleCategory(null)}
		></TagClickable>
		{#each categories as category}
			<TagClickable
				{category}
				style={categoriesActive.size > 0 && categoriesActive.has(category) ? 'active' : 'inactive'}
				big
				onclick={() => toggleCategory(category)}
			></TagClickable>
		{/each}
	</div>
	<p class="my-2">Then, toggle the scopes of work you're interested in:</p>
	<div class="flex flex-wrap gap-[0.2rem] px-[0.2rem]">
		<TagClickable
			category={null}
			everythingString="All Scopes"
			style={skillsScopeOnly.every((s) => skillsActive.has(s)) ? 'active' : 'inactive'}
			big
			onclick={() => enableAllScopes()}
		></TagClickable>
		{#each skills.filter((s) => SKILLS[s][1] == 'scope') as skill}
			<TagClickable
				{skill}
				style={skillsActive.has(skill) ? 'active' : 'inactive'}
				big
				onclick={() => toggleSkill(skill)}
			></TagClickable>
		{/each}
	</div>
	<br />
</header>

<style>
</style>
