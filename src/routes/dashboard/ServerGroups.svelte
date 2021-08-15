<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import Heading from "../../components/Heading.svelte"
	import type { ServerOverrides } from "../../domain/group/group.types"
	import {
		allGroups,
		getAllGroups,
		getServerOverrides,
	} from "../../domain/group/store"
	import type { Server } from "../../domain/server/server.types"
	import { allServers, getAllServers } from "../../domain/server/store"

	import Container from "./components/Container.svelte"
	import DualPane from "./components/DualPane.svelte"
	import Server from "./Server.svelte"

	export let id
	let server: Server = null
	let errmsg: string
	let overrides: ServerOverrides[]

	type GroupWithOverrides = {
		id?: number
		name: string
		color: number
		position: number
		permissions: bigint
		created_at?: Date
		modified_at?: Date
		allow_overrides: string
		deny_overrides: string
	}

	let groups = writable([] as GroupWithOverrides[])

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
			return
		}

		// Get group overrides for this server
		overrides = await getServerOverrides(id)

		// Get all groups
		await getAllGroups()

		for (const group of $allGroups) {
			let override: ServerOverrides

			// Check if this group has an override for this server
			for (const ovr of overrides) {
				if (ovr.group_id === group.id) {
					override = { ...ovr }
					break
				}
			}

			if (!override) {
				groups.set([
					...$groups,
					{
						...group,
						allow_overrides: "0",
						deny_overrides: "0",
					},
				])

				continue
			}

			groups.set([
				...$groups,
				{
					...group,
					allow_overrides: override.allow_overrides,
					deny_overrides: override.deny_overrides,
				},
			])
		}
	})
</script>

<Container>
	{#if server === null}
		<Heading type="title">{errmsg}</Heading>
	{:else}
		<Heading type="subtitle">{server.name} Group Management</Heading>
		<DualPane>
			<div slot="left-pane">
				{#each $groups as group}
					<div class="group">
						{group.name}
					</div>
				{/each}
			</div>

			<div slot="right-pane">
				<h1>Test 2</h1>
			</div>
		</DualPane>
	{/if}
</Container>

<style lang="scss">
</style>
