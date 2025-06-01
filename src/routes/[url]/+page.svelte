<script lang="ts">
	import ProjectList from '$lib/components/ProjectList.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	// Extract application and years from the page data
	const { application, years } = data;
</script>

<svelte:head>
	<title>{application.company} Application</title>
</svelte:head>

<h1>Introduction</h1>

<h1>Highlighted achievements</h1>
<pre><code>{JSON.stringify(application, null, 2)}</code></pre>

<h1>Here's the rest of my work:</h1>
<ProjectList {years} />

<style>
	pre {
		background-color: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 1rem;
		overflow-x: auto;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.875rem;
		line-height: 1.4;
		margin-bottom: 2rem;
	}

	code {
		color: #333;
	}
</style>
