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
		padding: 0.3rem 0.5rem;
	}
	summary {
		width: max-content;
		padding: 0 0.5rem;
		background-color: white;
		border-radius: 4px;
		box-shadow: 1px 1px 1px 0px #000000f0;
		cursor: pointer;
	}
	details[open] summary {
		font-weight: bold;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	details:not([open]) summary {
		font-size: 1.075rem;
	}
	.content {
		padding: 0.2rem 0.5rem;
		background-color: white;
		border-radius: 4px;
		border-top-left-radius: 0;
		box-shadow: 1px 1px 0px 1px #000000f0;
	}
</style>
