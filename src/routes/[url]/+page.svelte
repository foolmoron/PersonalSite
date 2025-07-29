<script lang="ts">
	import AchievementItem from '$lib/components/AchievementItem.svelte';
	import NameAndLinks from '$lib/components/NameAndLinks.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import {
		categories,
		skillsScopeOnly,
		toggleCategory,
		toggleSkill,
	} from '$lib/state/skills.svelte';
	import { marked } from 'marked';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	const { application, years } = data;
	const allProjects = years.flatMap((year) => year.projects);
	const allAchievements = allProjects.flatMap((project) => project.achievements);

	const highlightedAchievementsWithComment = application.highlightedAchievementIds
		.map((id, i) => ({
			achievement: allAchievements.find((achievement) => achievement.id === id),
			comment: application.highlightedComments[i] || '',
		}))
		.filter((highlight) => highlight.achievement !== undefined)
		.map((highlight) => ({
			...highlight.achievement!,
			comment: highlight.comment,
			project: allProjects.find((project) => project.id === highlight.achievement?.projectId),
		}));

	// Toggle default categories and scopes
	for (const category of categories) {
		toggleCategory(category, application.defaultCategories.includes(category));
	}
	for (const scope of skillsScopeOnly) {
		toggleSkill(scope, application.defaultScopes.includes(scope));
	}
</script>

<svelte:head>
	<title>Momin Khan - Resume for {application.company}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<NameAndLinks></NameAndLinks>
<header class="max-w-6xl">
	<p class="mb-4">
		Hello, <b>{application.company}</b>! Below I have highlighted a few relevant achievements for
		your <b>{application.role}</b> role, using my
		<a href="https://github.com/foolmoron/PersonalSite">interactive resume builder</a>. Click on
		each one for more info. When you're done, you can dig through the rest of my work on
		<a href="/">my homepage</a>, or at the
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_missing_attribute -->
		<a
			class="cursor-pointer"
			aria-label="Scroll to bottom of page"
			onclick={() => {
				document
					.querySelector('#afterhighlights')
					?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}}
		>
			bottom of this page
		</a>.
	</p>
	{#if application.introduction}
		{@html marked(application.introduction)}
		<div class="mb-4"></div>
	{/if}
</header>

{#each highlightedAchievementsWithComment as highlight}
	<section>
		{#if highlight.comment}
			<div class="mt-2">{@html marked(highlight.comment)}</div>
		{/if}
		<AchievementItem
			showProject
			achievement={highlight}
			project={highlight.project}
			{allAchievements}
		/>
	</section>
{/each}

<h1 class="my-4 scroll-mt-8" id="afterhighlights">
	That's it for the highlights! The following is the rest of my work, which you can see with more
	filter options on <a href="/">my homepage</a>:
</h1>
<ProjectList {years} />

<style>
</style>
