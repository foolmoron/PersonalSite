<script module lang="ts">
	export type SkillOrTagOrCategory =
		| { skill: keyof typeof SKILLS; tag?: undefined; category?: undefined }
		| { skill?: undefined; tag: keyof typeof TAGS; category?: undefined }
		| { skill?: undefined; tag?: undefined; category: keyof typeof CATEGORIES | null };

	export type TagProps = SkillOrTagOrCategory & {
		style?: 'active' | 'inactive';
	};
</script>

<script lang="ts">
	import { SKILLS, TAGS, CATEGORIES } from '$lib/enums';

	const props: TagProps = $props();

	const styleClass = $derived(props.style ?? 'active');
</script>

{#if props.skill !== undefined}
	<div class="tag skills-{SKILLS[props.skill][1]} {styleClass}">{SKILLS[props.skill][0]}</div>
{:else if props.tag !== undefined}
	<div class="tag tags-{props.tag} {styleClass}">{TAGS[props.tag][0]}</div>
{:else if props.category !== undefined}
	{#if props.category == null}
		<div class="tag categories-everything {styleClass}">Everything</div>
	{:else}
		<div class="tag categories-{props.category} {styleClass}">
			{CATEGORIES[props.category].name}
		</div>
	{/if}
{/if}

<style>
	.tag {
		padding: 0.1rem 0.5rem;
		font-size: smaller;
		border-radius: 1rem;
	}

	.tag.inactive {
		opacity: 0.6;
	}
</style>
