<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import TripleToggle from "../../components/TripleToggle.svelte"
	import { isSuperAdmin } from "../../domain/auth/store"
	import type { ServerOverrides } from "../../domain/group/group.types"
	import {
		allGroups,
		getAllGroups,
		getServerOverrides,
	} from "../../domain/group/store"
	import type { Server } from "../../domain/server/server.types"
	import { allServers, getAllServers } from "../../domain/server/store"
	import { getAllPermissions } from "../../permissions/permissions"
	import { decimalToHex } from "../../utils/color"
	import BottomBar from "./components/BottomBar.svelte"

	import Container from "./components/Container.svelte"
	import DualPane from "./components/DualPane.svelte"

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

	let currentGroup: GroupWithOverrides = null
	let previousGroup: GroupWithOverrides = null
	let changesWereMade = false
	const permissions = getAllPermissions()
	permissions.filter((p) => p.scope === "any" || p.scope === "server")

	function switchGroups(group: GroupWithOverrides) {
		if (changesWereMade) {
			highlightChangeError()
			return
		}

		currentGroup = { ...group }
		previousGroup = { ...group }
	}

	function highlightChangeError() {
		shakeScreen()
		applyDangerBorder()
	}

	function shakeScreen() {
		const ele = document.getElementById("groups-container")

		ele.classList.add("shake")

		setTimeout(() => {
			ele.classList.remove("shake")
		}, 500)
	}

	function applyDangerBorder() {
		const ele = document.getElementById("groups-changes")

		ele.classList.add("danger-bg")

		setTimeout(() => {
			ele.classList.remove("danger-bg")
		}, 500)
	}
</script>

<Container>
	{#if server === null}
		<Heading type="title">{errmsg}</Heading>
	{:else}
		<Heading type="subtitle">{server.name} Group Management</Heading>
		<DualPane>
			<div slot="left-pane" class="groups-list">
				<div class="groups">
					{#each $groups as group}
						<div
							class="group"
							style={`color: #${decimalToHex(group.color)}`}
							on:click={() => switchGroups(group)}
						>
							{group.name}
						</div>
					{/each}
				</div>
			</div>

			<div slot="right-pane" class="manager">
				{#if currentGroup === null}
					<p>
						Please select a group to manage it's permission overrides for this
						server.
					</p>
				{:else}
					<Heading>{currentGroup.name}</Heading>

					<div class="permissions-list">
						<Heading>Permissions</Heading>

						{#each permissions as permission}
							{#if permission.id !== 1}
								<div class="permission">
									<div class="main">
										<div class="name">
											{permission.display_name}
										</div>
										<TripleToggle name={permission.name} />
									</div>

									<div class="description">
										{permission.description}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</DualPane>
	{/if}
</Container>

{#if changesWereMade}
	<BottomBar>
		<div class="changes-bar" id="groups-changes">
			<p>
				You have unsaved changes. Please save or revert them before continuing.
			</p>
			<div class="buttons">
				<Button color="danger">Revert</Button>
				<Button>Save</Button>
			</div>
		</div>
	</BottomBar>
{/if}

<style lang="scss">
	@import "../../mixins/mixins";

	.groups-list {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		height: 100%;
		max-height: 100%;
		overflow-y: scroll;

		.group {
			font-size: 1.6rem;
			padding: 0.6rem;
			border-radius: var(--border-sm);
			user-select: none;

			&:hover {
				background-color: var(--color-background1);
				cursor: pointer;
			}

			span.order {
				font-family: monospace;
				color: var(--color-text-muted2);
				width: 3rem;
				overflow-x: hidden;
			}
		}

		.group.selected {
			background-color: var(--color-accent);
		}

		.bottom {
			margin-top: 1rem;

			:global(.btn) {
				width: 100%;
			}
		}

		.groups {
			@include respond-below(sm) {
				overflow-y: scroll;
			}
		}
	}

	.manager {
		.permissions-list {
			margin-top: 2rem;
		}

		.permission {
			width: 100%;
			margin: 2rem 0;

			.main {
				margin-bottom: 1rem;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.name {
					font-size: 1.8rem;
					width: calc(100% - 11rem);
				}

				@include respond-below(sm) {
					font-size: 1.4rem;
					font-weight: 600;
				}
			}

			.description {
				font-size: 1.2rem;
				color: var(--color-text-muted);
				text-align: justify;
			}
		}
	}
</style>
