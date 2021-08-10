<script lang="ts">
	import { onMount } from "svelte"
	import Container from "./components/Container.svelte"

	export let id

	onMount(async () => {
		// Try to get server from allServers
		console.log("SERVER ID", id)
	})
</script>

<Container>
	<h1>Test</h1>
</Container>

<style lang="scss">
</style>
