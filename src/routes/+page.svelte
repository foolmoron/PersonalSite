<script lang="ts">
	import ProjectItem from '$lib/components/ProjectItem.svelte';
	import type { PageServerData } from './$types';
	import { skillsActive } from '$lib/state/skills.svelte';
	import type { Project, Achievement } from '$lib/server/db/schema';
	import { SKILLS } from '$lib/enums';
	import Header from '$lib/components/Header.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';

	let { data }: { data: PageServerData } = $props();

	const { years } = data;
</script>

<Header></Header>

<ProjectList {years}></ProjectList>

<style>
</style>
