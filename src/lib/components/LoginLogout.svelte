<script lang="ts">
	import type { User } from '$lib/server/db/schema';

	interface Props {
		user?: User;
	}

	const { user }: Props = $props();
</script>

{#if user}
	<h1>Hi, {user.username}! Your Google ID is {user.googleId}.</h1>
	<a href="/logout" data-sveltekit-reload>Sign out</a>
{:else}
	<a href="/login/google">Sign in with Google</a>
{/if}
