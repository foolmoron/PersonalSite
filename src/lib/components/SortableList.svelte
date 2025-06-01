<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import Sortable, { type MoveEvent, type SortableEvent } from 'sortablejs';
	interface Props {
		items: unknown[];
		render: (item: unknown, index: number) => unknown;
	}

	let { items = $bindable(), render }: Props = $props();
	const dispatch = createEventDispatcher();

	let listEl = $state<HTMLDivElement>();
	let sortable = $state<Sortable>();

	function handleRemoveEvent(e: Event) {
		const customEvent = e as CustomEvent;
		dispatch('remove', customEvent.detail);
	}
	function handleCommentChangeEvent(e: Event) {
		const customEvent = e as CustomEvent;
		dispatch('commentchange', customEvent.detail);
	}

	onMount(() => {
		if (!listEl) return;
		sortable = Sortable.create(listEl, {
			animation: 150,
			// Only allow sorting within the list, prevent drop outside
			removeCloneOnHide: false,
			onEnd: (evt: SortableEvent) => {
				evt.item.remove(); // Avoid Svelte weirdness
				// Reorder the items array directly
				if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
					const [movedItem] = items.splice(evt.oldIndex, 1);
					items.splice(evt.newIndex, 0, movedItem);
				}
			},
		});
		// Listen for custom events from rendered content and forward them
		listEl.addEventListener('remove', handleRemoveEvent);
		listEl.addEventListener('commentchange', handleCommentChangeEvent);
	});
	onDestroy(() => {
		if (listEl) {
			listEl.removeEventListener('remove', handleRemoveEvent);
			listEl.removeEventListener('commentchange', handleCommentChangeEvent);
		}
		sortable?.destroy();
	});
</script>

<div bind:this={listEl}>
	{#each items as item, i (Math.random())}
		{@html render(item, i)}
	{/each}
</div>
