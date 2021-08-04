<script lang="ts">
	import Container from "./components/Container.svelte"
	import Heading from "../../components/Heading.svelte"
	import DualPane from "./components/DualPane.svelte"
	import { onMount } from "svelte"
	import { loading, setLoading } from "../../domain/loading/store"
	import {
		addUserGroup,
		allUsers,
		deactivateUser,
		getAllUsers,
		reactivateUser,
		removeUserGroup,
	} from "../../domain/user/store"
	import Spinner from "../../components/Spinner.svelte"
	import { writable } from "svelte/store"
	import type { User } from "../../domain/user/user.types"
	import Button from "../../components/Button.svelte"
	import { getTopGroup } from "../../utils/groups"
	import { decimalToHex } from "../../utils/color"
	import type { Group } from "../../domain/group/group.types"
	import { allGroups, getAllGroups } from "../../domain/group/store"
	import Checkbox from "../../components/Checkbox.svelte"
	import { group_outros } from "svelte/internal"
	import Groups from "./Groups.svelte"
	import {
		checkFlag,
		FLAG_ADMINISTRATOR,
		FLAG_SUPER_ADMIN,
		getFlag,
	} from "../../permissions/permissions"
	import { isAdmin, isSuperAdmin, self } from "../../domain/auth/store"
	import CreateUserModal from "../../components/Modals/CreateUserModal.svelte"
	import Flair from "../../components/Flair.svelte"
	import DeleteModal from "../../components/Modals/DeleteModal.svelte"

	const baseGroupId = -1

	onMount(async () => {
		setLoading("users", true)

		await getAllGroups()
		await getAllUsers()

		setLoading("users", false)
	})

	let users = writable([])
	let activatedUsers = writable([])
	let deactivatedUsers = writable([])
	$: users.set([...$allUsers])
	$: activatedUsers.set([...$allUsers].filter((usr) => !usr?.meta?.deactivated))
	$: deactivatedUsers.set(
		[...$allUsers].filter((usr) => usr?.meta?.deactivated),
	)
	let changesWereMade = false
	let previousUser: User = null
	let currentUser: User = null
	let currentUserIsAdmin = false
	let currentUserIsSuperAdmin = false

	function selectUser(user: User) {
		previousUser = user
		currentUser = user

		currentUserIsAdmin = checkFlag(
			user.permissions,
			getFlag(FLAG_ADMINISTRATOR),
		)

		currentUserIsSuperAdmin = checkFlag(
			user.permissions,
			getFlag(FLAG_SUPER_ADMIN),
		)
	}

	async function toggleGroup({ target }, group: Group) {
		const grant = target.checked

		if (grant) {
			await addUserGroup(currentUser.id, group)
		} else {
			await removeUserGroup(currentUser.id, group.id)
		}
	}

	function canSetGroup(group: Group): boolean {
		// If the user is a superadmin, return true
		if ($isSuperAdmin) return true

		// If the target user is an admin or super admin, return false
		if (currentUserIsAdmin || currentUserIsSuperAdmin) {
			return false
		}

		// If the group does not have admin permissions and the user is an admin, return true
		if (
			!checkFlag(group.permissions, getFlag(FLAG_ADMINISTRATOR)) &&
			$isAdmin
		) {
			return true
		}

		// Otherwise, return false
		return false
	}

	async function deactivateCurrentUser() {
		await deactivateUser(currentUser.id)
	}

	async function reactivateCurrentUser() {
		await reactivateUser(currentUser.id)
	}

	$: console.log($users)
</script>

{#if $loading["users"]}
	<Spinner blocking={true} />
{/if}

<Container>
	<Heading type="title">Users</Heading>

	<DualPane>
		<div slot="left-pane" class="users-list">
			<div class="users">
				{#each $activatedUsers as user}
					<div
						class="user"
						class:selected={currentUser && currentUser.id === user.id}
						on:click={() => selectUser(user)}
						style={`color: #${decimalToHex(getTopGroup(user.groups).color)}`}
					>
						{user.username}
					</div>
				{/each}

				<div class="deactivated-heading">Deactivated Users</div>
				{#each $deactivatedUsers as user}
					<div
						class="user"
						class:selected={currentUser && currentUser.id === user.id}
						class:deactivated={true}
						on:click={() => selectUser(user)}
						style={`color: #${decimalToHex(getTopGroup(user.groups).color)}`}
					>
						{user.username}
					</div>
				{/each}
			</div>

			<div class="bottom">
				<CreateUserModal>
					<div slot="trigger" let:open>
						<Button on:click={open}>Invite User</Button>
					</div>
				</CreateUserModal>
			</div>
		</div>

		<div slot="right-pane" class="user-manager">
			{#if currentUser !== null}
				<Heading type="subtitle">
					{currentUser.username}
				</Heading>
				<div class="flairs">
					{#if currentUserIsSuperAdmin}
						<Flair background="#D02F3F">Super Admin</Flair>
					{/if}

					{#if currentUserIsAdmin}
						<Flair background="#D54856">Admin</Flair>
					{/if}

					{#if currentUser.meta?.deactivated}
						<Flair color="disabled">Deactivated</Flair>
					{/if}
				</div>

				<div class="manager">
					<div class="role-select">
						{#each $allGroups as group, index}
							<div class="role" style={`color: #${decimalToHex(group.color)}`}>
								{#if group.id !== baseGroupId}
									<Checkbox
										name={`${group.id}-${group.name}`}
										label={group.name}
										checked={currentUser.groups.filter((g) => g.id === group.id)
											.length > 0}
										on:change={(e) => toggleGroup(e, group)}
										disabled={!canSetGroup(group)}
									/>
								{:else}
									<Checkbox
										name={`${group.id}-${group.name}`}
										label={group.name}
										checked={true}
										disabled={true}
									/>
								{/if}
							</div>
						{/each}
					</div>

					<div class="other">
						<div class="deactivate">
							{#if currentUser.meta && !currentUser.meta.deactivated}
								<p>
									To maintain the integrity of data, user accounts cannot be
									deleted. Instead, they can be deactivated to prevent access to
									Refractor.
								</p>

								<DeleteModal
									heading={`Deactivating User ${currentUser.username}`}
									message="Are you sure you wish to deactivate this user account? This will revoke their access to Refractor."
									submitText="Deactivate"
									on:submit={deactivateCurrentUser}
								>
									<div slot="trigger" let:open>
										<Button color="danger" on:click={open}
											>Deactivate Account</Button
										>
									</div>
								</DeleteModal>
							{:else if currentUser.meta && currentUser.meta.deactivated}
								<p>
									This user account is deactivated meaning that they currently
									have no access to Refractor. If you wish, you can reactivate
									their account using the button below.
								</p>

								<DeleteModal
									heading={`Reactivating User ${currentUser.username}`}
									message="Are you sure you wish to activate this user account? This will restore their access to Refractor."
									submitText="Reactivate"
									on:submit={reactivateCurrentUser}
								>
									<div slot="trigger" let:open>
										<Button color="warning" on:click={open}
											>Reactivate Account</Button
										>
									</div>
								</DeleteModal>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<p>Select a user to manage them.</p>
			{/if}
		</div>
	</DualPane>
</Container>

<style lang="scss">
	@import "../../mixins/mixins";

	.users-list {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		height: 100%;

		.user {
			font-size: 1.6rem;
			padding: 0.6rem;
			border-radius: var(--border-sm);
			user-select: none;

			&:hover {
				background-color: var(--color-background1);
				cursor: pointer;
			}
		}

		.deactivated {
			color: var(--color-text-muted2) !important;
			border-right: 4px solid var(--color-text-muted2);
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		.user.selected {
			background-color: var(--color-accent);
		}

		.users {
			@include respond-below(sm) {
				overflow-y: scroll;
			}

			.deactivated-heading {
				font-size: 1.2rem;
				padding-top: 0.5rem;
				margin-top: 1rem;
				color: var(--color-text-muted);
				border-top: 1px solid var(--color-accent);
			}
		}

		.bottom {
			margin-top: 1rem;

			:global(.btn) {
				width: 100%;
			}
		}
	}

	.user-manager {
		height: 100%;
		width: 100%;
		max-height: 100%;
		display: flex;
		flex-direction: column;

		.flairs {
			margin-top: 0.5rem;
		}

		.manager {
			margin-top: 1rem;
			width: 100%;
			height: calc(100% - 4rem);
			display: grid;
			grid-template-columns: minmax(20rem, 1fr) 3fr;
			grid-column-gap: 2rem;

			@include respond-below(sm) {
				grid-template-rows: auto auto;
				grid-template-columns: auto;
				grid-column-gap: 0;
				grid-row-gap: 2rem;
			}

			.role-select {
				padding: 1rem;
				border-radius: var(--border-sm);
				background-color: var(--color-background2-dark);
				height: 100%;
				overflow-y: scroll;

				.role {
					height: 3rem;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-left: 1rem;

					:global(.checkbox-wrapper) {
						width: 100%;
					}
				}
			}

			.other {
				.deactivate {
					p {
						font-size: 1.2rem;
						color: var(--color-text-muted);
						margin-bottom: 1rem;
					}

					margin-bottom: 2rem;
				}
			}
		}
	}
</style>
