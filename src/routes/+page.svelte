<script lang="ts">
	import ProjectItem from '$lib/components/ProjectItem.svelte';

	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="gradient-bg">
	{#each data.years as { year, projects }}
		{#each projects as project}
			<ProjectItem {project}></ProjectItem>
		{/each}
	{/each}
</div>
