<script lang="ts">
	import Header from '../lib/components/Header.svelte';

	import LoginLogout from '$lib/components/LoginLogout.svelte';
	import '../app.css';
	let { children, data } = $props();
</script>

<svelte:head>
	<title>Momin Khan - Game Developer and Software Engineer</title>
</svelte:head>

<LoginLogout user={data.user} />

<Header></Header>

{@render children()}
