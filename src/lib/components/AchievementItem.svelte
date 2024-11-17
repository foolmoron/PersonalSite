<script lang="ts">
	import type { Achievement } from '$lib/server/db/schema';
	import Tag from './Tag.svelte';

	let { achievement }: { achievement: Achievement } = $props();
</script>

<details>
	<summary>
		<p>{achievement.summary}</p>
		<div class="tags-container hide-when-empty">
			{#each achievement.tags as tag}
				<Tag {tag}></Tag>
			{/each}
		</div>
	</summary>
	<p class="content">
		{achievement.description}
	</p>
</details>

<style>
	details {
		padding: 0.4rem 0.6rem;
	}
	summary {
		width: max-content;
		padding: 0.1rem 0.5rem 0.3rem;
		background-color: white;
		border-radius: 4px;
		box-shadow: 1px 1px 1px 0px #000000f0;
		cursor: pointer;
	}
	summary p {
		display: inline;
	}
	details[open] summary {
		padding-bottom: 0;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	details[open] summary p {
		font-weight: bold;
	}
	details:not([open]) summary p {
		font-size: 1.075rem;
	}
	.content {
		padding: 0.2rem 0.5rem;
		background-color: white;
		border-radius: 4px;
		border-top-left-radius: 0;
		box-shadow: 1px 1px 0px 1px #000000f0;
	}
	.tags-container {
		display: inline-flex;
		gap: 0.2rem;
		margin-left: 1rem;
	}
</style>
