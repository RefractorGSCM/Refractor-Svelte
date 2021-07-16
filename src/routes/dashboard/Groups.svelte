<script lang="ts">
	import { onMount } from "svelte"
	import { group_outros, time_ranges_to_array } from "svelte/internal"
	import Button from "../../components/Button.svelte"
	import TripleToggle from "../../components/TripleToggle.svelte"
	import Heading from "../../components/Heading.svelte"
	import Spinner from "../../components/Spinner.svelte"
	import { allGroups, getAllGroups } from "../../domain/group/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import Container from "./components/Container.svelte"
	import Toggle from "../../components/Toggle.svelte"
	import type { Group } from "../../domain/group/group.types"
	import { writable } from "svelte/store"

	onMount(async () => {
		setLoading("groups", true)

		await getAllGroups()

		setLoading("groups", false)
	})

	let groups = writable([])
	$: groups.set([...$allGroups])

	function addGroup() {
		groups.set([
			...$groups,
			{
				name: "New Group",
				position: $groups.length + 1,
				color: 0,
			},
		])
	}

	let changesWereMade = false
	let previousGroup: Group = null
	let currentGroup: Group = null

	$: currentGroup = $groups[0]

	function shakeScreen() {
		const ele = document.getElementById("groups-wrapper")

		ele.classList.add("shake")

		setTimeout(() => {
			ele.classList.remove("shake")
		}, 500)
	}

	function applyDangerBorder() {
		const ele = document.getElementById("groups-changes")

		ele.classList.add("danger-border")

		setTimeout(() => {
			ele.classList.remove("danger-border")
		}, 2000)
	}

	function switchGroups(group: Group) {
		if (changesWereMade) {
			shakeScreen()
			applyDangerBorder()
			return
		}

		currentGroup = group
		previousGroup = group
	}
</script>

{#if $loading["groups"]}
	<Spinner blocking={true} />
{/if}

<Heading type="title">Groups</Heading>

<div class="wrapper" id="groups-wrapper">
	<div class="container">
		<div class="groups-list">
			<div class="groups">
				{#each $groups as group}
					<div
						class="group"
						style={`color: #${group.color.toString(16)}`}
						on:click={() => switchGroups(group)}
					>
						{group.name}
					</div>
				{/each}
			</div>

			<div class="bottom">
				<Button on:click={addGroup}>New Group</Button>
			</div>
		</div>

		<div class="manager">
			<div class="editor">
				{#if currentGroup}
					<Heading type="subtitle">{currentGroup.name}</Heading>

					<div class="permissions-list">
						<Heading>Permissions</Heading>

						<div class="permission">
							<div class="main">
								Administrator <Toggle name="administrator" />
							</div>

							<div class="description">
								Grants full access to Refractor. Administrator is required to be
								able to add, edit and delete servers as well as modify admin
								level settings. Only give this permission to people who
								absolutely need it.
							</div>
						</div>
					</div>
				{:else}
					<p>Select or create a group on the left sidebar to manage it.</p>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if changesWereMade}
	<div class="changes-bar" id="groups-changes">
		<p>
			You have unsaved changes. Please save or revert them before continuing.
		</p>
		<div class="buttons">
			<Button color="danger">Revert</Button>
			<Button>Save</Button>
		</div>
	</div>
{/if}

<style lang="scss">
	@import "../../effects/effects";

	.wrapper {
		width: 100%;
		position: relative;
	}

	:global(.shake) {
		animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
		transform: translate3d(0, 0, 0);
		backface-visibility: hidden;
		perspective: 1000px;
	}

	:global(.danger-border) {
		border: 2px solid var(--color-danger);
	}

	.container {
		margin-top: 2rem;
		display: grid;
		grid-template-columns: 1fr 3fr;
		grid-column-gap: 2rem;
		font-size: 1.6rem;
		height: 70vh;
		max-height: 70vh;

		> * {
			padding: 2rem;
			background-color: var(--color-background2);
			border-radius: var(--border-md);
		}
	}

	.changes-bar {
		padding: 2rem;
		background-color: var(--color-accent);
		margin-top: 2rem;
		border-radius: var(--border-md);
		display: flex;
		justify-content: space-between;
		align-items: center;

		p {
			font-size: 1.6rem;
		}

		:global(.btn) {
			margin-left: 0.5rem;
		}

		.buttons {
			min-width: 15rem;
		}
	}

	.groups-list {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.group {
			padding: 0.8rem;
			border-radius: var(--border-sm);
			user-select: none;

			&:hover {
				background-color: var(--color-background1);
				cursor: pointer;
			}
		}

		.bottom {
			margin-top: 1rem;

			:global(.btn) {
				width: 100%;
			}
		}
	}

	.manager {
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.editor {
			flex: 1;
		}

		.permissions-list {
			margin-top: 2rem;
		}

		.permission {
			width: 100%;
			margin: 2rem 0;

			.main {
				font-size: 1.8rem;
				margin-bottom: 1rem;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.description {
				font-size: 1.2rem;
				color: var(--color-text-muted);
			}
		}
	}
</style>
