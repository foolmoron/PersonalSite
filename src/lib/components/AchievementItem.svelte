<script lang="ts">
	import type { Achievement } from '$lib/server/db/schema';
	import Tag from './Tag.svelte';
	import { onMount } from 'svelte';

	// Maximum character length for URL slug (will round up to include the full word)
	const MAX_SLUG_CHAR_LENGTH = 32;

	let { achievement }: { achievement: Achievement } = $props();
	const popoverId = `achievement-popover-${achievement.id}`;

	// Create a URL-friendly slug from the achievement summary
	function createSlug(text: string): string {
		// Split text into words
		const words = text
			.replace(/[^\w\s-]/g, '')
			.split(' ')
			.filter((word) => word.length > 1);
		let result = '';

		// Add words until we exceed the character limit
		for (const word of words) {
			result += (result ? ' ' : '') + word;
			if (result.length > MAX_SLUG_CHAR_LENGTH) {
				break;
			}
		}

		// Clean up and format the slug
		return result.toLowerCase().replace(/\s+/g, '-');
	}

	// Combine ID with slug for the URL parameter
	const urlParam = `${achievement.id}-${createSlug(achievement.summary)}`;

	// Reference to the popup element
	let popupElement: HTMLElement;

	// Function to toggle the popup
	function togglePopup(open: boolean) {
		if (!popupElement) return;

		if (open) {
			popupElement.showPopover();
		} else {
			popupElement.hidePopover();
		}
	}

	// Handle URL changes
	onMount(() => {
		// Check URL param on initial load
		const urlParams = new URLSearchParams(window.location.search);
		const itemParam = urlParams.get('item');

		// Extract the ID part from the parameter (everything before the first dash)
		const itemId = parseInt(itemParam?.split('-')[0] ?? '0');

		// If URL contains this achievement's ID, open it
		if (itemId === achievement.id) {
			setTimeout(() => togglePopup(true), 0);
		}

		function handleToggle(event: Event) {
			const isOpen = popupElement.matches(':popover-open');

			if (isOpen) {
				const url = new URL(window.location.href);
				url.searchParams.set('item', urlParam);
				history.pushState({ item: achievement.id }, '', url.toString());
			} else {
				setTimeout(() => {
					// Only remove the query param if it matches this achievement's ID (another popup wasn't opened)
					const url = new URL(window.location.href);
					const currentItemParam = url.searchParams.get('item');
					const currentItemId = parseInt(currentItemParam?.split('-')[0] ?? '0');

					if (currentItemId === achievement.id) {
						url.searchParams.delete('item');
						history.pushState({ item: null }, '', url.toString());
					}
				}, 0);
			}
		}

		function handlePopstate(event: PopStateEvent) {
			const urlParams = new URLSearchParams(window.location.search);
			const itemParam = urlParams.get('item');
			const itemId = parseInt(itemParam?.split('-')[0] ?? '0');

			// Toggle based on URL parameter, temporarily remove toggle listener to avoid history thrashing
			popupElement.removeEventListener('toggle', handleToggle);
			togglePopup(itemId === achievement.id);
			setTimeout(() => {
				popupElement.addEventListener('toggle', handleToggle);
			}, 0);
		}

		popupElement.addEventListener('toggle', handleToggle);
		window.addEventListener('popstate', handlePopstate);
		return () => {
			popupElement.removeEventListener('toggle', handleToggle);
			window.removeEventListener('popstate', handlePopstate);
		};
	});
</script>

<div class="achievement-container">
	<button class="summary" popovertarget={popoverId} aria-haspopup="dialog">
		<p>
			{achievement.summary} <span style="font-size: 1.25rem; vertical-align: bottom;">ⓘ</span>
		</p>
	</button>

	<div id={popoverId} class="popup" popover="auto" bind:this={popupElement}>
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
		background-color: rgba(0, 0, 0, 0.03);
		box-shadow: 0px 0px 0px 1px #000000;
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
