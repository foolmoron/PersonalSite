<script lang="ts">
	import Header from '../lib/components/Header.svelte';

	import LoginLogout from '$lib/components/LoginLogout.svelte';
	import '../app.css';
	import { CATEGORIES, COLORS, TAGS } from '$lib/enums';
	import { injectSpeedInsights } from '@vercel/speed-insights';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectSpeedInsights();
	injectAnalytics();

	const { children, data } = $props();

	const skillsCss =
		`<style>` +
		Object.entries(COLORS)
			.map(([k, v]) => `.skills-${k} { background-color: ${v}; }`)
			.join('\n') +
		`</style>`;
	const tagsCss =
		`<style>` +
		Object.entries(TAGS)
			.map(([k, [_, v]]) => `.tags-${k} { background-color: ${v}; }`)
			.join('\n') +
		`</style>`;
	const categoriesCss =
		`<style>` +
		`.categories-everything { background-color: #c596ff; }\n` +
		Object.entries(CATEGORIES)
			.map(([k, v]) => `.categories-${k} { background-color: ${v.color}; }`)
			.join('\n') +
		`</style>`;
</script>

<svelte:head>
	<title>Momin Khan - Game Developer and Software Engineer</title>
	{@html skillsCss}
	{@html tagsCss}
	{@html categoriesCss}
</svelte:head>

<LoginLogout user={data.user} />

<Header></Header>

{@render children()}

<div style="height: 16rem;"></div>
