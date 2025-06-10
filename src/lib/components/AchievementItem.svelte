<script lang="ts">
	import { TAGS } from '$lib/enums';
	import { tags } from '$lib/state/skills.svelte';
	import type { Achievement, Project } from '$lib/server/db/schema';
	import ProjectHeader from './ProjectHeader.svelte';
	import Tag from './Tag.svelte';
	import { onMount } from 'svelte';
	import Portal from 'svelte-portal';

	// Maximum character length for URL slug (will round up to include the full word)
	const MAX_SLUG_CHAR_LENGTH = 32;

	interface Props {
		achievement: Achievement;
		project?: Project;
		allAchievements?: Achievement[];
	}

	let { achievement, project, allAchievements = [] }: Props = $props();
	const popoverId = `achievement-popover-${achievement.id}`;

	// Calculate similar achievements using a metric
	const MAX_SIMILAR_ITEMS = 3;

	/**
	 * Calculates a similarity score between two achievements
	 * Higher score = more similar
	 */
	function calculateSimilarity(a1: Achievement, a2: Achievement): number {
		// Don't compare to self
		if (a1.id === a2.id) return 0;

		let score = 0;

		// Project similarity (highest weight)
		if (a1.projectId === a2.projectId) {
			score += 5;
		}

		// Tag similarity - common tags increase similarity
		const a1Tags = new Set(a1.tags);
		for (const tag of a2.tags) {
			if (a1Tags.has(tag)) {
				score += 3;
			}
		}

		// Description similarity - check for some common words
		const commonKeywords = getCommonKeywords(a1.description || '', a2.description || '');
		score += commonKeywords.length * 0.5;

		// Summary similarity - check for common words
		const commonSummaryWords = getCommonKeywords(a1.summary, a2.summary);
		score += commonSummaryWords.length * 1;

		return score;
	}

	/**
	 * Extracts common significant words between two text strings
	 */
	function getCommonKeywords(text1: string, text2: string): string[] {
		if (!text1 || !text2) return [];

		// Skip common stop words
		const stopWords = new Set([
			'a',
			'an',
			'the',
			'and',
			'or',
			'but',
			'in',
			'on',
			'at',
			'to',
			'for',
			'with',
			'by',
			'about',
			'as',
			'of',
			'that',
			'this',
			'these',
			'those',
			'is',
			'are',
			'was',
			'were',
			'be',
			'been',
			'being',
			'have',
			'has',
			'had',
			'do',
			'does',
			'did',
			'can',
			'could',
			'will',
			'would',
			'should',
			'shall',
			'i',
			'you',
			'he',
			'she',
			'it',
			'we',
			'they',
		]);

		// Extract words from both texts (remove punctuation, make lowercase)
		const words1 = text1
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.split(/\s+/)
			.filter((word) => word.length > 2 && !stopWords.has(word));

		const words2 = text2
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.split(/\s+/)
			.filter((word) => word.length > 2 && !stopWords.has(word));

		// Find common words
		const set2 = new Set(words2);
		return words1.filter((word) => set2.has(word));
	}

	// Calculate similar achievements
	const similarAchievements = $derived(
		allAchievements
			.filter((a) => a.id !== achievement.id)
			.map((a) => ({
				achievement: a,
				similarityScore: calculateSimilarity(achievement, a),
			}))
			.filter((item) => item.similarityScore > 0)
			.sort((a, b) => b.similarityScore - a.similarityScore)
			.slice(0, MAX_SIMILAR_ITEMS)
			.map((item) => item.achievement),
	);

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

	// Function to handle "More Like This" link clicks
	function handleSimilarItemClick(similarAchievementId: number) {
		// First close the current popup
		setTimeout(() => togglePopup(false), 1);

		// We need to manually dispatch an event that other components can listen for
		window.dispatchEvent(
			new CustomEvent('achievement-selected', {
				detail: { id: similarAchievementId },
			}),
		);
	}

	// Handle URL changes
	onMount(() => {
		// Check URL param on initial load
		const urlParams = new URLSearchParams(window.location.search);
		const itemParam = urlParams.get('a');

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
				url.searchParams.set('a', urlParam);
				history.pushState({ a: achievement.id }, '', url.toString());
			} else {
				setTimeout(() => {
					// Only remove the query param if it matches this achievement's ID (another popup wasn't opened)
					const url = new URL(window.location.href);
					const currentItemParam = url.searchParams.get('a');
					const currentItemId = parseInt(currentItemParam?.split('-')[0] ?? '0');

					if (currentItemId === achievement.id) {
						url.searchParams.delete('a');
						history.pushState({ a: null }, '', url.toString());
					}
				}, 0);
			}
		}

		function handlePopstate(event: PopStateEvent) {
			const urlParams = new URLSearchParams(window.location.search);
			const itemParam = urlParams.get('a');
			const itemId = parseInt(itemParam?.split('-')[0] ?? '0');

			// Toggle based on URL parameter, temporarily remove toggle listener to avoid history thrashing
			popupElement.removeEventListener('toggle', handleToggle);
			togglePopup(itemId === achievement.id);
			setTimeout(() => {
				popupElement.addEventListener('toggle', handleToggle);
			}, 0);
		}

		// Listen for the custom achievement-selected event
		function handleAchievementSelected(e: CustomEvent) {
			const selectedId = e.detail?.id;
			if (selectedId === achievement.id) {
				// This is the achievement that should be opened, delay to allow <details> to open if needed
				setTimeout(() => togglePopup(true), 0);
			}
		}

		popupElement.addEventListener('toggle', handleToggle);
		window.addEventListener('popstate', handlePopstate);
		window.addEventListener('achievement-selected', handleAchievementSelected as EventListener);

		return () => {
			popupElement.removeEventListener('toggle', handleToggle);
			window.removeEventListener('popstate', handlePopstate);
			window.removeEventListener(
				'achievement-selected',
				handleAchievementSelected as EventListener,
			);
		};
	});
</script>

<div class="achievement-container">
	<button class="summary" popovertarget={popoverId} aria-haspopup="dialog">
		<p>
			{achievement.summary}
			<svg width="20" height="20" viewBox="0 0 20 20" class="inline align-bottom">
				<circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" stroke-width="1.2" />
				<text
					x="10"
					y="14.5"
					text-anchor="middle"
					font-family="sans-serif"
					font-size="12"
					font-weight="bold"
					fill="currentColor">i</text
				>
			</svg>
		</p>
	</button>
</div>

<Portal target="body">
	<div id={popoverId} class="popup" popover="auto" bind:this={popupElement}>
		{#if project}
			<div class="project-container">
				<ProjectHeader {project} infoOnly />
			</div>
		{/if}

		<div class="popup-content-container">
			<div class="popup-header">
				<h3>{achievement.summary}</h3>
			</div>
			<div class="tags-container">
				{#each (achievement.tags as (keyof typeof TAGS)[]).toSorted((a, b) => tags.indexOf(a) - tags.indexOf(b)) as tag}
					<Tag {tag} />
				{/each}
			</div>

			<div class="content">
				<p>{achievement.description}</p>
			</div>

			{#if similarAchievements.length > 0}
				<div class="similar-achievements">
					<h4>More like this...</h4>
					<ul>
						{#each similarAchievements as similarAchievement}
							<li>
								<button
									class="similar-item"
									onclick={() => handleSimilarItemClick(similarAchievement.id)}
								>
									{similarAchievement.summary}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
</Portal>

<style>
	:global(:root:has(.popup:popover-open)) {
		overflow: hidden;
	}

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
		overscroll-behavior: contain;
		transition:
			opacity 300ms ease-out,
			transform 300ms ease-out,
			display 300ms ease-out allow-discrete,
			overlay 300ms ease-out allow-discrete;
	}

	.popup-content-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.project-container {
		border-bottom: 1px solid #858585;
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
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
	}

	.popup-header h3 {
		margin: 0;
		font-size: 1.4rem;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.content {
		flex-grow: 1;
		overflow-y: auto;
	}

	.content p {
		margin: 0;
		line-height: 1.4;
		white-space: pre-wrap;
	}

	.similar-achievements {
		margin-top: 1rem;
	}

	.similar-achievements h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		font-weight: 500;
	}

	.similar-achievements ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.similar-achievements li {
		margin-bottom: 0.3rem;
	}

	.similar-item {
		background: none;
		border: none;
		padding: 0.2rem 0;
		cursor: pointer;
		text-align: left;
		color: #0066cc;
		font-family: inherit;
		font-size: 0.95rem;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.similar-item:hover {
		color: #004499;
	}
</style>
