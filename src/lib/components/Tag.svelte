<script lang="ts">
	import { SKILLS, TAGS } from '$lib/enums';

	const props:
		| { skill: keyof typeof SKILLS; tag?: undefined }
		| { skill?: undefined; tag: keyof typeof TAGS } = $props();

	const isSkill = props.skill !== undefined;
</script>

{#if isSkill}
	<div class="tag skills-{SKILLS[props.skill][1]}">{SKILLS[props.skill][0]}</div>
{:else}
	<div class="tag tags-{props.tag}">{TAGS[props.tag][0]}</div>
{/if}

<style>
	.tag {
		padding: 0.1rem 0.5rem;
		font-size: smaller;
		border-radius: 1rem;
	}
</style>
