<script lang="ts">
	import type { Achievement } from '$lib/server/db/schema';

	let { achievement }: { achievement: Achievement } = $props();
</script>

<details>
	<summary>
		{achievement.summary}
	</summary>
	<p class="content">
		{achievement.description}
	</p>
</details>

<style>
	details {
		padding: 0.5rem;
		margin: 0.5rem;
	}
	summary {
		width: max-content;
		padding: 0 0.5rem;
		background-color: white;
	}
	.content {
		background-color: white;
	}
</style>
