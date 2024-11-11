<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#if data.user}
	<h1>Hi, {data.user.username}!</h1>
	<p>Your Google ID is {data.user.googleId}.</p>
	<a href="/logout">Sign out</a>
{:else}
	<h1>Sign in</h1>
	<a href="/login/google">Sign in with Google</a>
{/if}
