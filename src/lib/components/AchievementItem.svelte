<script lang="ts">
	import type { Achievement } from '$lib/server/db/schema';
	import Tag from './Tag.svelte';

	let { achievement }: { achievement: Achievement } = $props();
	const popoverId = `achievement-popover-${achievement.id}`;
</script>

<div class="achievement-container">
	<button class="summary" popovertarget={popoverId} aria-haspopup="dialog">
		<p>{achievement.summary}</p>
	</button>

	<div id={popoverId} class="popup" popover="auto">
		<div class="popup-header">
			<h3>{achievement.summary}</h3>
		</div>

		<div class="tags-container">
			{#each achievement.tags as tag}
				<Tag {tag} />
			{/each}
		</div>

		<div class="content">
			<p>{achievement.description}</p>
		</div>
	</div>
</div>

<style>
	.achievement-container {
		position: relative;
		padding: 0.4rem 0.6rem;
	}

	.summary {
		max-width: max-content;
		padding: 0.3rem 0.5rem;
		background-color: white;
		line-height: 1.2rem;
		border: 1px solid #000000d3;
		cursor: pointer;
		font-size: 1.075rem;
		font-family: inherit;
		text-align: left;
	}

	.summary:hover {
		background-color: rgba(0, 0, 0, 0.06);
		box-shadow: 1px 1px 1px 0px #000000d4;
	}

	.summary:focus-visible {
		outline: 2px solid #0066cc;
		outline-offset: 2px;
	}

	.popup {
		position: fixed;
		top: 10%;
		left: 50%;
		width: 80%;
		max-width: 1000px;
		height: max-content;
		max-height: 80%;
		transform: translate(-50%, 0);
		opacity: 1;
		background-color: white;
		box-shadow: 3px 3px 2px 1px rgb(0 0 0 / 48%);
		padding: 1.5rem;
		overflow-y: auto;
		transition:
			opacity 300ms ease-out,
			transform 300ms ease-out,
			display 300ms ease-out allow-discrete,
			overlay 300ms ease-out allow-discrete;
	}

	.popup[popover]:not(:popover-open) {
		display: none;
		opacity: 0;
		transform: translate(-50%, 2rem);
	}

	@starting-style {
		.popup[popover]:popover-open {
			opacity: 0;
			transform: translate(-50%, 2rem);
		}
	}

	.popup::backdrop {
		background-color: rgba(0, 0, 0, 0.4);
		opacity: 0;
		transition:
			opacity 300ms ease-out,
			display 300ms ease-out allow-discrete,
			overlay 300ms ease-out allow-discrete;
	}
	.popup[popover]:popover-open::backdrop {
		opacity: 1;
	}
	@starting-style {
		.popup[popover]:popover-open::backdrop {
			opacity: 0;
		}
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.popup-header h3 {
		margin: 0;
		font-size: 1.4rem;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-bottom: 1rem;
	}

	.content {
		flex-grow: 1;
		overflow-y: auto;
	}

	.content p {
		margin: 0;
		line-height: 1.4;
	}
</style>
