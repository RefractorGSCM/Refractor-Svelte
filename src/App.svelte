<script lang="ts">
	import { onMount } from "svelte"
	import ThemeProvider from "./theme/ThemeProvider.svelte"
	import { Router, Route } from "svelte-routing"
	import StyleGuide from "./routes/StyleGuide.svelte"
	import Dashboard from "./routes/dashboard/Dashboard.svelte"
	import ProtectedRoute from "./components/ProtectedRoute.svelte"
	import { loading, setLoading } from "./domain/loading/store"
	import Spinner from "./components/Spinner.svelte"
	import { checkAuth } from "./domain/user/store"
	import { getPermissions } from "./domain/group/store"

	let authChecked = false
	onMount(async () => {
		setLoading("app", true)

		const isAuthentciated = await checkAuth()

		if (!isAuthentciated) {
			window.location.replace(`${process.env.authRoot}/k/login`)
		}

		if (isAuthentciated) {
			await getPermissions()
		}

		authChecked = true
		setLoading("app", false)
	})
</script>

<div class="refractor-app">
	<ThemeProvider />

	{#if $loading["app"]}
		<Spinner fullscreen={true} blocking={true} />
	{/if}

	{#if authChecked}
		<Router>
			<Route path="/styleguide" component={StyleGuide} />
			<ProtectedRoute path="/*" component={Dashboard} />
		</Router>
	{/if}
</div>

<style lang="scss" global>
	.refractor-app {
		box-sizing: border-box;
	}
</style>
