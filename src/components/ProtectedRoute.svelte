<script lang="ts">
	import { navigate, Route } from "svelte-routing"
	import NotLoggedIn from "../routes/NotLoggedIn.svelte"

	export let path: string
	export let component: any

	let isAuthenticated = true
</script>

{#if isAuthenticated}
	<Route {path} {component} />
{:else}
	<Route {path} component={NotLoggedIn} />
{/if}
