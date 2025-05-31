<script lang="ts">
	import { CATEGORIES, SKILLS } from '$lib/enums';
	import { SvelteSet } from 'svelte/reactivity';
	import TagClickable from './TagClickable.svelte';
	import { skills, skillsActive, tags, tagsActive } from '$lib/state/skills.svelte';
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

	const skillsScopeOnly = skills.filter((s) => SKILLS[s][1] == 'scope');
	const skillsWithoutScope = skills.filter((s) => SKILLS[s][1] != 'scope');

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
	const categoriesActive = $state<SvelteSet<keyof typeof CATEGORIES>>(new SvelteSet(categories));

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
			for (const c of categories) {
				categoriesActive.add(c);
			}
			for (const s of skillsWithoutScope) {
				skillsActive.add(s);
			}
			for (const t of tags) {
				tagsActive.add(t);
			}
		}
	}
</script>

<header class="max-w-6xl">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<h1 class="text-4xl" onclick={handleHeaderClick}>Momin Khan</h1>
	<h3 class="text-xl">Game Developer and Software Engineer</h3>
	<div class="mt-2 mb-8 flex gap-3">
		<a
			href="https://www.linkedin.com/in/momink/"
			target="_blank"
			class="flex gap-1 [&:hover]:underline"
		>
			<svg class="h-5 w-5 align-bottom" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
				/>
			</svg>
			LinkedIn
		</a>
		<a href="https://github.com/foolmoron/" target="_blank" class="flex gap-1 [&:hover]:underline">
			<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
			GitHub
		</a>
		<a href="mailto:momin@fool.dev" target="_blank" class="flex gap-1 [&:hover]:underline">
			<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.887.699-1.636 1.636-1.636h.174l1.284-.001L12 9.382l8.906-5.562h.458c.904 0 1.636.732 1.636 1.637z"
				/>
			</svg>
			Email
		</a>
	</div>
	<p class="my-4">
		Hi, welcome to my interactive resume builder. Don't be shy, it's easy! I had this idea after
		spending too much time tailoring my resume for dozens of jobs across 3 different industries.
		Here you can see my work at a high level, and dig into particular projects and achievements that
		interest you.
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
