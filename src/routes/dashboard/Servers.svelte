<script lang="ts">
	import { Link, navigate } from "svelte-routing"
	import { component_subscribe, onMount } from "svelte/internal"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import CreateServerModal from "../../components/Modals/CreateServerModal.svelte"
	import ConfirmModal from "../../components/Modals/ConfirmModal.svelte"
	import EditServerModal from "../../components/Modals/EditServerModal.svelte"
	import PermsCheck from "../../components/PermsCheck.svelte"
	import RequirePerms from "../../components/RequirePerms.svelte"
	import TripleToggle from "../../components/TripleToggle.svelte"
	import { serverPlayers } from "../../domain/player/store"
	import {
		allServers,
		deactivateServer,
		getAllServers,
	} from "../../domain/server/store"
	import {
		FLAG_ADMINISTRATOR,
		FLAG_SUPER_ADMIN,
		FLAG_VIEW_SERVERS,
		getFlag,
	} from "../../permissions/permissions"
	import Container from "./components/Container.svelte"

	async function deleteServer(id: number) {
		await deactivateServer(id)
	}

	$: console.log($allServers, $allServers.length)
</script>

<Container>
	{#if $allServers && $allServers.length > 0}
		<Heading type="title">Servers</Heading>

		<RequirePerms allOf={[FLAG_ADMINISTRATOR]}>
			<div class="add-button">
				<CreateServerModal>
					<div slot="trigger" let:open>
						<Button on:click={open}>Add Server</Button>
					</div>
				</CreateServerModal>
			</div>
		</RequirePerms>

		<div>
			<div class="servers">
				<div class="heading server">
					<div class="server-info">
						<div class="name">Name</div>
						<div class="players">Players</div>
						<div class="status">Status</div>
					</div>
					<div class="actions" />
				</div>

				{#each $allServers as server}
					<div class="server">
						<a
							href={`/server/${server.id}`}
							on:click|preventDefault={() => navigate(`/server/${server.id}`)}
						>
							<div class="server-info">
								<div class="name">
									<span class="icon fas fa-server" />{server.name}
								</div>
								<div class="players">{server.online_players.length}</div>
								<div class="status">{server.status}</div>
							</div>
						</a>
						<div class="actions">
							<EditServerModal initialValues={server} serverId={server.id}>
								<div slot="trigger" let:open>
									<Button
										color="success"
										size="inline"
										on:click={(e) => {
											e.stopPropagation()
											open()
										}}>Edit</Button
									>
								</div>
							</EditServerModal>

							<ConfirmModal
								heading={`Deleting server: ${server.name}`}
								message="Are you sure you wish to delete this server?"
								on:submit={() => deleteServer(server.id)}
							>
								<div slot="trigger" let:open>
									<Button
										color="danger"
										size="inline"
										on:click={(e) => {
											e.stopPropagation()
											open()
										}}>Delete</Button
									>
								</div>
							</ConfirmModal>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="no-servers">
			<Heading type="title">No servers have been added yet.</Heading>

			<RequirePerms allOf={[FLAG_ADMINISTRATOR]}>
				<p>Click the Add Server button to add your first server!</p>

				<div class="add-button">
					<CreateServerModal>
						<div slot="trigger" let:open>
							<Button on:click={open}>Add Server</Button>
						</div>
					</CreateServerModal>
				</div>
			</RequirePerms>
		</div>
	{/if}
</Container>

<style lang="scss">
	@import "../../mixins/mixins.scss";

	.no-servers {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 1.6rem;

		p {
			margin-top: 1rem;
		}
	}

	.add-button {
		margin-top: 2rem;
	}

	.servers {
		margin-top: 1rem;
		display: grid;
		grid-row-gap: 1rem;
		grid-template-rows: auto;
		font-size: 1.8rem;

		@include respond-below(xl) {
			font-size: 1.6rem;
		}

		.heading {
			background-color: var(--color-accent) !important;
			cursor: unset !important;
		}

		.server {
			display: grid;
			grid-template-columns: 3.5fr 0.5fr;
			grid-template-rows: auto;
			background-color: var(--color-background2);
			align-items: center;
			border-radius: var(--border-sm);
			transition: background-color 0.1s;

			&:hover {
				background-color: var(--color-background1);
				cursor: pointer;
			}

			.server-info {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				align-items: center;
				padding: 1rem 1.5rem;
				color: var(--color-text2);
			}

			.actions {
				display: flex;
				align-items: center;
				padding-right: 1.5rem;
			}

			@include respond-below(sm) {
				grid-template-columns: 1fr;

				.players {
					display: none;
				}

				.status {
					display: none;
				}

				.actions {
					display: none;
				}

				.server-info {
					grid-template-columns: 1fr;
				}
			}
		}

		.name .icon {
			color: var(--color-primary);
			margin-right: 1rem;
		}

		.actions {
			display: flex;
			justify-content: right;

			:global(.btn:first-child) {
				margin-right: 0.5rem;
			}
		}

		:global(.server-action-last) {
			margin-left: 1rem;
		}
	}
</style>
