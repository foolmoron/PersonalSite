<script lang="ts">
	import EmbeddedMedia from './EmbeddedMedia.svelte';

	const { urls } = $props<{
		urls: string[];
	}>();

	let selectedIndex = $state<number>(0);
	let lightboxPopover: HTMLElement;

	function openLightbox(index: number) {
		selectedIndex = index;
		lightboxPopover?.showPopover();
	}

	function closeLightbox() {
		lightboxPopover?.hidePopover();
	}

	function goToPrevious() {
		selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : urls.length - 1;
	}

	function goToNext() {
		selectedIndex = selectedIndex < urls.length - 1 ? selectedIndex + 1 : 0;
	}
	function handleKeydown(e: KeyboardEvent) {
		if (!lightboxPopover?.matches(':popover-open')) return;

		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goToPrevious();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			goToNext();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			closeLightbox();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if urls.length > 0}
	<div class="media-list">
		{#each urls as url, index}
			<button class="media-thumbnail" onclick={() => openLightbox(index)} type="button">
				<EmbeddedMedia {url} />
			</button>
		{/each}
	</div>
	<div bind:this={lightboxPopover} popover="auto" class="lightbox">
		<div class="lightbox-content">
			{#if urls.length > 1}
				<button
					class="nav-button nav-left"
					onclick={goToPrevious}
					type="button"
					aria-label="Previous media"
				>
					‹
				</button>

				<button
					class="nav-button nav-right"
					onclick={goToNext}
					type="button"
					aria-label="Next media"
				>
					›
				</button>
			{/if}

			<div class="media-container">
				<EmbeddedMedia url={urls[selectedIndex]} />
			</div>
		</div>
	</div>
{/if}

<style>
	:global(:root:has(.lightbox:popover-open)) {
		overflow: hidden;
	}

	.media-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.media-thumbnail {
		border: none;
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0;
		cursor: pointer;
		border-radius: 4px;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.media-thumbnail:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.media-thumbnail :global(.embedded-media) {
		width: 100%;
		height: 8rem;
		object-fit: cover;
		margin: 0;
	}

	.media-thumbnail :global(.embedded-media.image) {
		height: 8rem;
		object-fit: cover;
	}

	.media-thumbnail :global(.embedded-media.video) {
		height: 8rem;
		object-fit: cover;
	}
	.media-thumbnail :global(.embedded-media.vimeo) {
		width: 14rem;
		height: 8rem;
	}
	.media-thumbnail :global(.embedded-media.youtube) {
		width: 14rem;
		height: 8rem;
		pointer-events: none;
	}
	.media-thumbnail :global(.embedded-media.googledrive) {
		height: 8rem;
		pointer-events: none;
	}
	.lightbox {
		border: none;
		padding: 0;
		background-color: transparent;
		margin: auto;
		max-width: 92vw;
		max-height: 92vh;
		pointer-events: none;
	}

	.lightbox::backdrop {
		background: rgba(0, 0, 0, 0.7);
	}

	.lightbox-content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 3.5rem;
		box-sizing: border-box;
	}
	.lightbox-content * {
		pointer-events: all;
	}
	.nav-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.7);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		cursor: pointer;
		font-size: 20px;
		font-weight: normal;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1001;
		transition: all 0.2s ease;
		opacity: 0.6;
	}

	.nav-button:hover {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.9);
		opacity: 1;
	}

	.nav-left {
		left: 0;
	}

	.nav-right {
		right: 0;
	}

	.media-container {
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.media-container :global(.embedded-media) {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		margin: 0;
	}

	.media-container :global(.embedded-media.image) {
		max-width: 90vw;
		max-height: 90vh;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	.media-container :global(.embedded-media.video) {
		max-width: 90vw;
		max-height: 90vh;
		width: auto;
		height: auto;
	}
	.media-container :global(.embedded-media.youtube),
	.media-container :global(.embedded-media.googledrive) {
		width: min(90vw, 1200px);
		height: min(90vh, 675px);
		aspect-ratio: 16/9;
	}
</style>
