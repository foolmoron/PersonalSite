<script lang="ts">
	import type { PageServerData } from './$types';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import NameAndLinks from '$lib/components/NameAndLinks.svelte';
	import IntroductionWithToggles from '$lib/components/IntroductionWithToggles.svelte';

	let { data }: { data: PageServerData } = $props();

	const { years } = data;
</script>

<NameAndLinks></NameAndLinks>
<IntroductionWithToggles></IntroductionWithToggles>

<ProjectList {years}></ProjectList>

<style>
</style>
