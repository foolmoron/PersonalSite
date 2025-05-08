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
		`.categories-everything { background-color: #e0b2ff; }\n` +
		Object.entries(CATEGORIES)
			.map(([k, v]) => `.categories-${k} { background-color: ${v.color}; }`)
			.join('\n') +
		`</style>`;
</script>

<svelte:head>
	<title>Momin Khan - Game Developer and Software Engineer</title>
	<meta
		name="description"
		content="Personal site and dynamic resume builder of Momin Khan - game developer and software engineer."
	/>
	{@html skillsCss}
	{@html tagsCss}
	{@html categoriesCss}
</svelte:head>

<LoginLogout user={data.user} />

<div class="container">
	{@render children()}
</div>

<div style="height: 16rem;"></div>

<style>
	:global(body) {
		padding: 0 0.6rem;
	}

	.container {
		width: 100%;
		max-width: 72rem;
		margin: auto;
	}
</style>
