<script lang="ts">
	import type { PageData } from './$types';
	import ProjectItem from '$lib/components/ProjectItem.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="gradient-bg">
	{#each data.years as { year, projects }}
		{#each projects as project}
			<ProjectItem {project} open={data.id === project.id}></ProjectItem>
		{/each}
	{/each}
</div>
