<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import TripleToggle from "../../components/TripleToggle.svelte"
	import { isSuperAdmin } from "../../domain/auth/store"
	import type {
		Permission,
		ServerOverrides,
	} from "../../domain/group/group.types"
	import {
		allGroups,
		getAllGroups,
		getServerOverrides,
	} from "../../domain/group/store"
	import type { Server } from "../../domain/server/server.types"
	import { allServers, getAllServers } from "../../domain/server/store"
	import {
		getAllPermissions,
		getFlag,
		getSetFlags,
	} from "../../permissions/permissions"
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
	let previousAllowOverrides: string[] = []
	let previousDenyOverrides: string[] = []
	let currentAllowOverrides = writable([] as string[])
	let currentDenyOverrides = writable([] as string[])
	const permissions = getAllPermissions()
	permissions.filter((p) => p.scope === "any" || p.scope === "server")

	function switchGroups(group: GroupWithOverrides) {
		if (changesWereMade) {
			highlightChangeError()
			return
		}

		currentGroup = { ...group }
		previousGroup = { ...group }
		previousAllowOverrides = getSetFlags(BigInt(group.allow_overrides))
		previousDenyOverrides = getSetFlags(BigInt(group.deny_overrides))
		currentAllowOverrides = writable([...previousAllowOverrides])
		currentDenyOverrides = writable([...previousDenyOverrides])

		changesWereMade = false

		console.log(group.name, "deny", group.deny_overrides)
		console.log(group.name, "allow", group.allow_overrides)
	}

	function revertChanges() {
		currentGroup = {
			...previousGroup,
		}
		previousAllowOverrides = getSetFlags(BigInt(currentGroup.allow_overrides))
		previousDenyOverrides = getSetFlags(BigInt(currentGroup.deny_overrides))
		currentAllowOverrides.set([...previousAllowOverrides])
		currentDenyOverrides.set([...previousDenyOverrides])

		changesWereMade = false
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

	function handlePermissionChange(e) {
		const name = e.detail.target.name

		if (e.detail.target.value === "true") {
			currentDenyOverrides.set($currentDenyOverrides.filter((p) => p !== name))
			$currentAllowOverrides.push(name)
		} else if (e.detail.target.value === "false") {
			currentAllowOverrides.set(
				$currentAllowOverrides.filter((p) => p !== name),
			)
			$currentDenyOverrides.push(name)
		} else {
			currentDenyOverrides.set($currentDenyOverrides.filter((p) => p !== name))
			currentAllowOverrides.set(
				$currentAllowOverrides.filter((p) => p !== name),
			)
		}

		if (
			$currentAllowOverrides !== previousAllowOverrides ||
			$currentDenyOverrides !== previousDenyOverrides
		) {
			changesWereMade = true
		}
	}

	function computeOverrides(): ServerOverrides {
		let computedAllow = BigInt(0)

		for (const flagName of $currentAllowOverrides) {
			const flag = getFlag(flagName)

			computedAllow = BigInt(computedAllow) | BigInt(flag)
		}

		let computedDeny = BigInt(0)

		for (const flagName of $currentDenyOverrides) {
			const flag = getFlag(flagName)

			computedDeny = BigInt(computedDeny) | BigInt(flag)
		}

		return {
			group_id: currentGroup.id,
			allow_overrides: computedAllow.toString(),
			deny_overrides: computedDeny.toString(),
		}
	}

	function saveChanges() {}
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
					<Heading type="subtitle">{currentGroup.name}</Heading>

					<p class="description">
						This page will allow you to override permissions of a group on
						specific servers.
					</p>

					<div class="permissions-list">
						<Heading>Permissions</Heading>

						{#each permissions as permission}
							{#if permission.id !== 1}
								<div class="permission">
									<div class="main">
										<div class="name">
											{permission.display_name}
										</div>
										<TripleToggle
											name={permission.name}
											on:change={handlePermissionChange}
											value={(function () {
												if ($currentAllowOverrides.includes(permission.name)) {
													return "true"
												}

												if ($currentDenyOverrides.includes(permission.name)) {
													return "false"
												}

												return "unset"
											})()}
										/>
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
				<Button color="danger" on:click={revertChanges}>Revert</Button>
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
		}
	}

	.description {
		font-size: 1.2rem;
		color: var(--color-text-muted);
		text-align: justify;
	}

	.changes-bar {
		height: 6rem;
		width: 100%;
		padding: 0 3rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: background-color 0.1s ease-in-out;
		font-size: 1.6rem;

		.buttons {
			min-width: 20rem;
			display: flex;
			justify-content: right;
		}

		:global(.btn) {
			margin-left: 0.5rem;
		}

		@include respond-below(md) {
			font-size: 1.4rem;
		}

		@include respond-below(sm) {
			height: auto;
			font-size: 1.2rem;
			flex-direction: column;
			padding: 0;

			p {
				padding: 1rem 3rem;
			}

			.buttons {
				width: 100%;
				display: flex;
			}

			:global(.btn) {
				margin-left: 0;
				font-size: 1.2rem;
				padding: 0;
				height: 2.5rem;
				width: 100%;
				border-radius: 0;
			}
		}
	}
</style>
