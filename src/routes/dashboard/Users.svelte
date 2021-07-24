<script lang="ts">
	import Container from "./components/Container.svelte"
	import Heading from "../../components/Heading.svelte"
	import DualPane from "./components/DualPane.svelte"
	import { onMount } from "svelte"
	import { loading, setLoading } from "../../domain/loading/store"
	import { allUsers, getAllUsers } from "../../domain/user/store"
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

	const baseGroupId = -1

	onMount(async () => {
		setLoading("users", true)

		await getAllUsers()
		await getAllGroups()

		setLoading("users", false)
	})

	let users = writable([])
	$: users.set([...$allUsers])
	let changesWereMade = false
	let previousUser: User = null
	let currentUser: User = null

	function selectUser(user: User) {
		previousUser = user
		currentUser = user
	}

	$: if ($users.length > 0) {
		selectUser($users[0])
	}
</script>

{#if $loading["users"]}
	<Spinner blocking={true} />
{/if}

<Container>
	<Heading type="title">Users</Heading>

	<DualPane>
		<div slot="left-pane" class="users-list">
			<div class="users">
				{#each $users as user, index}
					<div
						class="user"
						class:selected={currentUser && currentUser.id === user.id}
						style={`color: #${decimalToHex(getTopGroup(user.groups).color)}`}
						on:click={() => selectUser(user)}
					>
						{user.username}
					</div>
				{/each}
			</div>

			<div class="bottom">
				<Button>Invite User</Button>
			</div>
		</div>

		<div slot="right-pane" class="user-manager">
			{#if currentUser !== null}
				<Heading type="subtitle">Managing: {currentUser.username}</Heading>

				<div class="manager">
					<div class="role-select">
						{#each $allGroups as group, index}
							<div class="role" style={`color: #${decimalToHex(group.color)}`}>
								{#if group.id !== baseGroupId}
									<Checkbox
										name={`${group.id}-${group.name}`}
										label={group.name}
									/>
								{:else}
									<div>{group.name}</div>
								{/if}
							</div>
						{/each}
					</div>

					<div class="other" />
				</div>
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

		.user.selected {
			background-color: var(--color-accent);
		}

		.users {
			@include respond-below(sm) {
				overflow-y: scroll;
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

		.manager {
			margin-top: 1rem;
			width: 100%;
			height: calc(100% - 4rem);
			display: grid;
			grid-template-columns: minmax(20rem, 1fr) 3fr;
			grid-column-gap: 2rem;

			> * {
				padding: 1rem;
			}

			.role-select {
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
			}
		}
	}
</style>
