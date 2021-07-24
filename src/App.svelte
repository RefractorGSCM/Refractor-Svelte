<script lang="ts">
	import { onMount } from "svelte"
	import ThemeProvider from "./theme/ThemeProvider.svelte"
	import { Router, Route } from "svelte-routing"
	import StyleGuide from "./routes/StyleGuide.svelte"
	import Dashboard from "./routes/dashboard/Dashboard.svelte"
	import ProtectedRoute from "./components/ProtectedRoute.svelte"
	import { loading, setLoading } from "./domain/loading/store"
	import Spinner from "./components/Spinner.svelte"
	import {
		checkAuth,
		isAuthenticated,
		needsActivation,
	} from "./domain/auth/store"
	import { getPermissions } from "./domain/group/store"
	import Activate from "./routes/Activate.svelte"

	let authChecked = false
	onMount(async () => {
		setLoading("app", true)

		await checkAuth()

		if (!$isAuthenticated && !$needsActivation) {
			window.location.replace(`${process.env.authRoot}/k/login`)
		}

		if ($isAuthenticated) {
			await getPermissions()
		}

		console.log("isAuthenticated", $isAuthenticated)

		authChecked = true
		setLoading("app", false)
	})
</script>

<div class="refractor-app">
	<ThemeProvider />

	{#if $loading["app"]}
		<Spinner fullscreen={true} blocking={true} />
	{/if}

	<Router>
		{#if authChecked && $isAuthenticated}
			<Route path="/styleguide" component={StyleGuide} />
			<ProtectedRoute path="/*" component={Dashboard} />
		{:else if authChecked && $needsActivation}
			<Route path="/" component={Activate} />
		{/if}
	</Router>
</div>

<style lang="scss" global>
	.refractor-app {
		box-sizing: border-box;
	}
</style>
