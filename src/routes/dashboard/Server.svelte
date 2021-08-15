<script lang="ts">
	import { onMount } from "svelte"
	import { Route, Router } from "svelte-routing"
	import Heading from "../../components/Heading.svelte"
	import type { Server } from "../../domain/server/server.types"
	import {
		allServers,
		getAllServers,
		getServerById,
	} from "../../domain/server/store"
	import Container from "./components/Container.svelte"
	import ServerGroups from "./ServerGroups.svelte"

	export let id
	let server: Server = null
	let errmsg: string

	onMount(async () => {
		try {
			id = parseInt(id)
		} catch (e) {
			errmsg = "Server not found"
			return
		}

		if ($allServers.length === 0) {
			await getAllServers()
		}

		let found = false
		for (const s of $allServers) {
			if (s.id === id) {
				found = true
				server = s
			}
		}

		if (!found) {
			errmsg = "Server not found"
		}
	})
</script>

<Container>
	{#if server === null}
		<Heading type="title">{errmsg}</Heading>
	{:else}
		<Heading type="title">{server.name}</Heading>
	{/if}
</Container>

<style lang="scss">
</style>
