<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import Tag, { type TagProps } from './Tag.svelte';

	const props: TagProps & { onclick?: EventHandler<Event> } = $props();
	const onclick = props.onclick;
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<a role="button" href="javascript:;" {onclick}><Tag {...props}></Tag></a>

<style>
</style>
