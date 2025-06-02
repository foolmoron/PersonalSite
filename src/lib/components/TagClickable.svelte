<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import Tag, { type TagProps } from './Tag.svelte';

	const props: TagProps & { onclick?: EventHandler<Event> } = $props();
	const onclick = props.onclick;
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<button {onclick}><Tag {...props}></Tag></button>

<style>
	button {
		cursor: pointer;
	}
</style>
