<script lang="ts">
	import { onMount } from "svelte"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import Spinner from "../../components/Spinner.svelte"
	import {
		allGroups,
		createGroup,
		deleteGroup,
		getAllGroups,
	} from "../../domain/group/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import Container from "./components/Container.svelte"
	import Toggle from "../../components/Toggle.svelte"
	import type { Group, NewGroupParams } from "../../domain/group/group.types"
	import { writable } from "svelte/store"
	import type { Writable } from "svelte/store"
	import {
		FLAG_ADMINISTRATOR,
		FLAG_VIEW_SERVERS,
		getDescription,
		getFlag,
		getSetFlags,
	} from "../../permissions/permissions"
	import BottomBar from "./components/BottomBar.svelte"
	import { sortAsc } from "../../utils/sorting"
	import TextInput from "../../components/TextInput.svelte"
	import Modal from "../../components/Modals/Modal.svelte"
	import DeleteModal from "../../components/Modals/DeleteModal.svelte"

	const baseGroupId = -1

	onMount(async () => {
		setLoading("groups", true)

		await getAllGroups()

		setLoading("groups", false)
	})

	let hovering = -1
	let groups = writable([])
	$: groups.set([...$allGroups])

	let editingNewGroup = false
	let changesWereMade = false
	let previousGroup: Group = null
	let currentGroup: Group = null
	let currentPermissions = writable([])
	let errors: Writable<{
		name?: string
		color?: string
	}> = writable({})

	function dragstart(e, index: number) {
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.dropEffect = "move"
		const start = index
		e.dataTransfer.setData("text/plain", start)
	}

	function drop(e, target: number) {
		if (editingNewGroup) {
			// If we are editing a new group, we do not want to allow group reordering.
			// This is because reordering a group which the server does not yet know about
			// would not have the desired result, and would likely break something.
			highlightChangeError()
			return
		}

		e.dataTransfer.dropEffect = "move"
		const start = parseInt(e.dataTransfer.getData("text/plain"))

		if (start == target) {
			// do not process the event if a group was dragged on itself
			return
		}

		const newTrackgroups = [...$groups]

		if (start < target) {
			if (target === $groups.length - 1) {
				// do not allow the default group (everyone) to be moved
				hovering = -1
				return
			}

			newTrackgroups.splice(target + 1, 0, newTrackgroups[start])
			newTrackgroups.splice(start, 1)
		} else if (start > target) {
			newTrackgroups.splice(target, 0, newTrackgroups[start])
			newTrackgroups.splice(start + 1, 1)
		}

		hovering = -1
		groups.set(newTrackgroups)
		submitGroupReorder(newTrackgroups)
	}

	function submitGroupReorder(ordered) {
		setLoading("groups-reorder", true)

		setTimeout(() => {
			setLoading("groups-reorder", false)
		}, 300)
	}

	function addGroup() {
		if (changesWereMade) {
			highlightChangeError()
			return
		}

		const newGroup: Group = {
			name: "New Group",
			position: $groups.length,
			color: "cecece",
			permissions: BigInt(0),
		}

		groups.set(sortAsc("position", [...$groups, newGroup]))

		switchGroups(newGroup)
		editingNewGroup = true
		changesWereMade = true
	}

	function highlightChangeError() {
		shakeScreen()
		applyDangerBorder()
	}

	function switchGroups(group: Group) {
		if (changesWereMade) {
			highlightChangeError()
			return
		}

		editingNewGroup = false
		currentGroup = group
		previousGroup = { ...group }
		currentPermissions.set(getSetFlags(group.permissions))
	}

	function revertChanges() {
		currentGroup = { ...previousGroup }
		currentPermissions.set(getSetFlags(previousGroup.permissions))
		errors.set({})

		// If we are reverting a new group creation, we filter out all groups which do not have an ID field
		if (editingNewGroup) {
			const newGroups: Group[] = []

			for (const group of $groups) {
				if (group.id !== undefined) {
					newGroups.push(group)
				}
			}

			groups.set([...newGroups])
			deselectGroup()
			return
		}

		const copy = [...$groups]

		// Undo changes committed to groups array
		copy.forEach((g) => {
			if (g.id === currentGroup.id) {
				g.name = currentGroup.name
				g.color = currentGroup.color
			}
		})

		groups.set([...copy])

		changesWereMade = false
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
		const flag = getFlag(name)

		if (e.detail.target.value === "true") {
			// currentPermissions = BigInt(currentPermissions) | BigInt(flag)
		} else {
			// currentPermissions = BigInt(currentPermissions) & ~BigInt(flag)
		}

		changesWereMade = true
	}

	function handleGroupNameChange(e) {
		currentGroup.name = e.target.value

		if (currentGroup.name !== previousGroup.name) {
			changesWereMade = true
		}

		// Update name in groups array
		const copy = [...$groups]

		copy.forEach((g) => {
			if (g.id === currentGroup.id) {
				g.name = currentGroup.name
			}
		})

		groups.set([...copy])
	}

	function deselectGroup() {
		currentGroup = null
		previousGroup = null
		editingNewGroup = false
		changesWereMade = false
	}

	function handleGroupColorChange({ target }) {
		if (!/^[0-9A-F]{6}$/i.test(target.value.toString().trim())) {
			errors.set({
				...$errors,
				color: "Invalid hex color code",
			})

			return
		} else {
			errors.set({
				...$errors,
				color: undefined,
			})
		}

		currentGroup.color = target.value

		if (currentGroup.color !== previousGroup.color) {
			changesWereMade = true
		}

		// Update color in groups array
		const copy = [...$groups]

		copy.forEach((g) => {
			if (g.id === currentGroup.id) {
				g.color = currentGroup.color
			}
		})

		groups.set([...copy])
	}

	function errorsExist() {
		for (const key of Object.keys($errors)) {
			if ($errors[key]) {
				return true
			}
		}

		return false
	}

	async function saveChanges() {
		if (currentGroup.name.trim().length < 1) {
			errors.set({
				...$errors,
				name: "Please enter a group name",
			})
		} else {
			errors.set({
				...$errors,
				name: undefined,
			})
		}

		if (errorsExist()) {
			console.log($errors)
			shakeScreen()
			return
		}

		if (editingNewGroup) {
			setLoading("groups", true)

			const newGroup: NewGroupParams = {
				name: currentGroup.name,
				color: parseInt(currentGroup.color.toString(), 16),
				position: currentGroup.position,
				permissions: currentGroup.permissions.toString(),
			}

			console.log("Creating a new group", newGroup)

			await createGroup(newGroup)

			setLoading("groups", false)

			currentGroup = null
			editingNewGroup = false
			changesWereMade = false
			return
		}

		// otherwise, update existing group
	}

	async function handleDeleteGroup() {
		const groupID = currentGroup.id

		setLoading("groups", true)
		await deleteGroup(groupID)
		setLoading("groups", false)

		console.log("Group deleted", groupID)

		deselectGroup()
	}
</script>

{#if $loading["groups"]}
	<Spinner blocking={true} />
{/if}

<Container>
	<Heading type="title">Groups</Heading>
	<div class="container" id="groups-container">
		<div class="groups-list">
			{#if $loading["groups-reorder"]}
				<Spinner />
			{/if}

			<div class="groups">
				{#each $groups as group, index}
					<div
						class="group"
						class:selected={currentGroup && currentGroup.id === group.id}
						style={`color: #${group.color.toString(16)}`}
						on:click={() => switchGroups(group)}
						draggable={group.id !== 1}
						on:dragstart={(e) => dragstart(e, index)}
						on:drop|preventDefault={(e) => drop(e, index)}
						ondragover={"return false"}
						on:dragend={() => (hovering = -1)}
						on:dragenter={() => (hovering = index)}
						class:hovering={group.id !== baseGroupId && hovering === index}
					>
						<span class="order">{index + 1}</span>
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
					<div class="group-header">
						<div class="inputs">
							<div class="group-name">
								{#if currentGroup.id !== baseGroupId}
									<TextInput
										name="group-name"
										autocomplete="off"
										label="Group Name"
										value={currentGroup.name}
										error={$errors.name}
										on:input={handleGroupNameChange}
									/>
								{:else}
									<Heading type="subtitle">Everyone</Heading>
								{/if}
							</div>

							<div class="group-color">
								<div
									class="preview"
									style={`background: #${currentGroup.color.toString(16)}`}
								/>

								<TextInput
									name="group-color"
									autocomplete="off"
									label="Group Color"
									value={currentGroup.color.toString(16)}
									error={$errors.color}
									on:input={handleGroupColorChange}
								/>
							</div>
						</div>

						{#if currentGroup.id === baseGroupId}
							<p class="group-description">
								Everyone is the default group assigned to all users. Changing
								the permission switches below will modify the default
								permissions of all users.
							</p>
						{/if}
					</div>

					<div class="permissions-list">
						<Heading>Permissions</Heading>

						<div class="permission">
							<div class="main">
								Administrator <Toggle
									name={FLAG_ADMINISTRATOR}
									on:change={handlePermissionChange}
									value={String(
										$currentPermissions.includes(FLAG_ADMINISTRATOR),
									)}
								/>
							</div>

							<div class="description">
								{getDescription(FLAG_ADMINISTRATOR)}
							</div>
						</div>

						<div class="permission">
							<div class="main">
								View servers <Toggle
									name={FLAG_VIEW_SERVERS}
									on:change={handlePermissionChange}
									value={String(
										$currentPermissions.includes(FLAG_VIEW_SERVERS),
									)}
								/>
							</div>

							<div class="description">
								{getDescription(FLAG_VIEW_SERVERS)}
							</div>
						</div>
					</div>

					{#if currentGroup.id !== baseGroupId && !editingNewGroup}
						<div class="delete-button">
							<DeleteModal
								heading={`Deleting group: ${currentGroup.name}`}
								message="Are you sure you wish to delete this group?"
							>
								<div slot="trigger" let:open>
									<Button color="danger" on:click={open}>Delete Group</Button>
								</div>
							</DeleteModal>
						</div>
					{/if}
				{:else}
					<p>Select or create a group to manage it.</p>
				{/if}
			</div>
		</div>
	</div>
</Container>

{#if changesWereMade}
	<BottomBar>
		<div class="changes-bar" id="groups-changes">
			<p>
				You have unsaved changes. Please save or revert them before continuing.
			</p>
			<div class="buttons">
				<Button color="danger" on:click={revertChanges}>Revert</Button>
				<Button on:click={saveChanges}>Save</Button>
			</div>
		</div>
	</BottomBar>
{/if}

<style lang="scss">
	@import "../../effects/effects";
	@import "../../mixins/mixins";

	:global(.shake) {
		animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
		transform: translate3d(0, 0, 0);
		backface-visibility: hidden;
		perspective: 1000px;
	}

	:global(.danger-bg) {
		background-color: var(--color-danger);
	}

	:global(.hovering) {
		outline: 2px dashed var(--color-primary);
	}

	.container {
		margin-top: 2rem;
		margin-bottom: 6rem;
		display: grid;
		grid-template-columns: minmax(25rem, 1fr) 4fr;
		grid-column-gap: 2rem;
		font-size: 1.8rem;
		min-height: 70vh;
		max-height: 100vh;

		@include respond-below(lg) {
			font-size: 1.6rem;
		}

		> * {
			padding: 2rem;
			background-color: var(--color-background2);
			border-radius: var(--border-md);
		}

		@include respond-below(sm) {
			grid-template-rows: 30vh auto;
			grid-template-columns: auto;
			grid-row-gap: 2rem;
		}
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

	.groups-list {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;

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
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
		padding-bottom: 4rem;

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

		.group-header {
			min-height: 7rem;

			.inputs {
				display: flex;
				justify-content: space-between;

				.group-color {
					display: flex;

					.preview {
						height: 3rem;
						width: 3rem;
						margin-top: 1rem;
						margin-right: 1rem;
						border-radius: var(--border-sm);
					}
				}
			}

			.group-description {
				margin-top: 1rem;
				font-size: 1.2rem;
				color: var(--color-text-muted);
			}
		}

		.delete-button {
			position: absolute;
			bottom: 2rem;
			left: 2rem;
		}
	}
</style>
