<script lang="ts">
	import { onMount } from "svelte"
	import ThemeProvider from "./theme/ThemeProvider.svelte"
	import { Router, Route } from "svelte-routing"
	import StyleGuide from "./routes/StyleGuide.svelte"
	import Dashboard from "./routes/dashboard/Dashboard.svelte"
	import ProtectedRoute from "./components/ProtectedRoute.svelte"
	import { loading, setLoading } from "./domain/loading/store"
	import Spinner from "./components/Spinner.svelte"

	let authChecked = false
	onMount(async () => {
		authChecked = true
	})
</script>

<ThemeProvider />

{#if $loading["app"]}
	<Spinner fullscreen={true} />
{/if}

{#if authChecked}
	<Router>
		<Route path="/styleguide" component={StyleGuide} />
		<ProtectedRoute path="/" component={Dashboard} />
	</Router>
{/if}
