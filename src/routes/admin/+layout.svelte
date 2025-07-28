<script lang="ts">
	import LoginLogout from '$lib/components/LoginLogout.svelte';

	const { children, data } = $props();
</script>

<LoginLogout user={data.user} />

{@render children()}

<style>
</style>
