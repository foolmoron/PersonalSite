<script lang="ts">
	import type { User } from '$lib/server/db/schema';

	interface Props {
		user?: User;
	}

	const { user }: Props = $props();
</script>

{#if user}
	<nav class="user-navbar">
		<div class="user-info">
			<span class="username">{user.username}</span>
		</div>
		<div class="nav-links">
			<a href="/">Home</a>
			<a href="/admin/projects">Projects</a>
			<a href="/admin/apps">Apps</a>
			<a href="/logout" data-sveltekit-reload>Sign out</a>
		</div>
	</nav>
{/if}

<style>
	.user-navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		background-color: #f5f5f5;
		border-radius: 4px;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.username {
		font-weight: bold;
	}

	.user-id {
		font-size: 0.8rem;
		color: #666;
	}

	.nav-links {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.nav-links a {
		text-decoration: none;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		color: #333;
		transition: background-color 0.2s;
	}

	.nav-links a:hover {
		background-color: #e0e0e0;
	}

	.nav-links a[href='/logout'] {
		color: #d32f2f;
	}
</style>
