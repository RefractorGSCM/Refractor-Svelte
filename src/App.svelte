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
		getSelfInfo,
		isAuthenticated,
		needsActivation,
	} from "./domain/auth/store"
	import { getPermissions } from "./domain/group/store"
	import Activate from "./routes/Activate.svelte"
	import { SvelteToast } from "@zerodevx/svelte-toast"
	import RequirePerms from "./components/RequirePerms.svelte"

	let authChecked = false
	onMount(async () => {
		setLoading("app", true)

		await checkAuth()

		if (!$isAuthenticated && !$needsActivation) {
			window.location.replace(`${AUTH_ROOT}/k/login`)
			return
		}

		if ($isAuthenticated) {
			await getPermissions()
			await getSelfInfo()
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

	<div class="toast-wrap">
		<SvelteToast />
	</div>

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
		--toastBackground: var(--color-background1);
		--toastWidth: 22rem;
		--toastMinHeight: 6rem;
		--toastMsgPadding: 0 1rem;
		--toastBorderRadius: var(--border-sm);
	}

	.toast-wrap {
		font-size: 1.4rem;
		color: var(--color-text1);
	}
</style>
