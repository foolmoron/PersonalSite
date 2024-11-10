<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

{#if data.user}
	<h1>Hi, {data.user.username}!</h1>
	<p>Your Google ID is {data.user.googleId}.</p>
	<form method="post" action="?/logout" use:enhance>
		<button>Sign out</button>
	</form>
{:else}
	<h1>Sign in</h1>
	<a href="/login/google">Sign in with Google</a>
{/if}
