<script lang="ts">
	import Header from '../lib/components/Header.svelte';

	import LoginLogout from '$lib/components/LoginLogout.svelte';
	import '../app.css';
	import { COLORS, TAGS } from '$lib/enums';
	import { injectSpeedInsights } from '@vercel/speed-insights';

	injectSpeedInsights();

	const { children, data } = $props();

	const skillsCss =
		`${'<sty'}le>` +
		Object.entries(COLORS)
			.map(([k, v]) => `.skills-${k} { background-color: ${v}; }`)
			.join('\n') +
		`</style>`;
	const tagsCss =
		`${'<sty'}le>` +
		Object.entries(TAGS)
			.map(([k, [_, v]]) => `.tags-${k} { background-color: ${v}; }`)
			.join('\n') +
		`</style>`;
</script>

<svelte:head>
	<title>Momin Khan - Game Developer and Software Engineer</title>
	{@html skillsCss}
	{@html tagsCss}
</svelte:head>

<LoginLogout user={data.user} />

<Header></Header>

{@render children()}
