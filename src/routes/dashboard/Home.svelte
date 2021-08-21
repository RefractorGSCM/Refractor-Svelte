<script lang="ts">
	import { Link, navigate } from "svelte-routing"
	import { component_subscribe, onMount } from "svelte/internal"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import CreateServerModal from "../../components/Modals/CreateServerModal.svelte"
	import DeleteModal from "../../components/Modals/DeleteModal.svelte"
	import EditServerModal from "../../components/Modals/EditServerModal.svelte"
	import PermsCheck from "../../components/PermsCheck.svelte"
	import RequirePerms from "../../components/RequirePerms.svelte"
	import TripleToggle from "../../components/TripleToggle.svelte"
	import { getAllServers, allServers } from "../../domain/server/store"
	import {
		FLAG_ADMINISTRATOR,
		FLAG_SUPER_ADMIN,
		FLAG_VIEW_SERVERS,
		getFlag,
	} from "../../permissions/permissions"
	import Container from "./components/Container.svelte"
	import Server from "./Server.svelte"

	onMount(async () => {
		await getAllServers()
	})

	async function deleteServer(id: number) {
		console.log("Deleting server", id)
	}
</script>

<Container>
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
			<div class="heading">
				<div class="name">Name</div>
				<div class="players">Players</div>
				<div class="status">Status</div>
				<div class="actions" />
			</div>

			{#each $allServers as server}
				<div
					class="server"
					on:click={() =>
						navigate(`/server/${server.id}`, {
							replace: false,
							state: { serverId: server.id },
						})}
				>
					<div class="name">
						<span class="icon fas fa-server" />{server.name}
					</div>
					<div class="players">?</div>
					<div class="status">?</div>
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

						<DeleteModal
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
						</DeleteModal>
					</div>
				</div>
			{/each}
		</div>
	</div>
</Container>

<style lang="scss">
	@import "../../mixins/mixins.scss";

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

		.server {
			display: grid;
			grid-template-columns: 1.2fr 1fr 1fr 0.4fr;
			grid-template-rows: auto;
			background-color: var(--color-background2);
			padding: 1rem 1.5rem;
			align-items: center;
			border-radius: var(--border-sm);
			transition: background-color 0.1s;

			&:hover {
				background-color: var(--color-background1);
				cursor: pointer;
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
			}
		}

		.name .icon {
			color: var(--color-primary);
			margin-right: 1rem;
		}

		.heading {
			display: grid;
			grid-template-columns: 1.2fr 1fr 1fr 0.4fr;
			grid-template-rows: auto;
			background-color: var(--color-accent);
			padding: 1rem;
			border-radius: var(--border-sm);

			@include respond-below(sm) {
				display: none;
			}
		}

		.actions {
			display: flex;
			justify-content: right;
		}

		:global(.server-action-last) {
			margin-left: 1rem;
		}
	}
</style>
