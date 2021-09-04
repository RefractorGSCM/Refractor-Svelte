<script lang="ts">
	import { onMount } from "svelte"
	import { Link } from "svelte-routing"
	import Button from "../../components/Button.svelte"
	import Flair from "../../components/Flair.svelte"

	import Heading from "../../components/Heading.svelte"
	import CreateBanModal from "../../components/Modals/CreateBanModal.svelte"
	import CreateKickModal from "../../components/Modals/CreateKickModal.svelte"
	import CreateMuteModal from "../../components/Modals/CreateMuteModal.svelte"
	import CreateWarningModal from "../../components/Modals/CreateWarningModal.svelte"
	import type { Player } from "../../domain/player/player.types"
	import { getPlayer, serverPlayers } from "../../domain/player/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let platform: string = ""
	export let id: string = ""
	let errmsg = ""

	let player: Player
	onMount(async () => {
		player = await getPlayer(id, platform)

		if (!player) {
			errmsg = "Player not found"
			return
		}
	})

	console.log($serverPlayers)

	let currentlyOnline = false
	let serverId = 0
	let found = false
	$: {
		found = false
		for (const [id, server] of Object.entries($serverPlayers)) {
			for (const player of Object.values(server)) {
				console.log("Online Player", player)
				if (player.id === id && player.platform === platform) {
					found = true
					serverId = parseInt(id)
					console.log("online", currentlyOnline)
					break
				}
			}
		}
		currentlyOnline = found
	}
</script>

<Container>
	{#if errmsg.length > 0}
		<Heading type="subtitle">{errmsg}</Heading>
	{:else}
		<SinglePane>
			<div class="heading">
				<Heading type="title">Player</Heading>
				<div class="status">
					<div class="status__item">
						<span>Platform:</span>{platform}
					</div>
					<div class="status__item">
						<span>ID:</span>{id}
					</div>
					{#if currentlyOnline}
						<div class="status__item">
							<Link to={`/server/${serverId}`}>
								<Flair color="success">Online</Flair>
							</Link>
						</div>
					{/if}
				</div>

				<div class="buttons">
					<CreateWarningModal {player}>
						<div slot="trigger" let:openWarning>
							<Button on:click={openWarning}>Log Warning</Button>
						</div>
					</CreateWarningModal>

					<CreateMuteModal {player}>
						<div slot="trigger" let:openMute>
							<Button on:click={openMute}>Log Mute</Button>
						</div>
					</CreateMuteModal>

					<CreateKickModal {player}>
						<div slot="trigger" let:openKick>
							<Button color="warning" on:click={openKick}>Log Kick</Button>
						</div>
					</CreateKickModal>

					<CreateBanModal {player}>
						<div slot="trigger" let:openBan>
							<Button color="danger" on:click={openBan}>Log Ban</Button>
						</div>
					</CreateBanModal>
				</div>
			</div>
		</SinglePane>

		<div class="infraction-section">
			<SinglePane>
				<Heading>Warnings</Heading>
				<div class="infraction-list" />
			</SinglePane>

			<SinglePane>
				<Heading>Mutes</Heading>
				<div class="infraction-list" />
			</SinglePane>

			<SinglePane>
				<Heading>Kicks</Heading>
				<div class="infraction-list" />
			</SinglePane>

			<SinglePane>
				<Heading>Bans</Heading>
				<div class="infraction-list" />
			</SinglePane>
		</div>
	{/if}
</Container>

<style lang="scss">
	@import "../../mixins/mixins";

	.heading {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		> * {
			margin-top: 1rem;
		}

		.status {
			display: flex;

			> * {
				margin-right: 2rem;

				&:last-child {
					margin-right: 0;
				}
			}

			&__item {
				font-size: 1.6rem;

				span {
					color: var(--color-primary-light);
					margin-right: 0.4rem;
				}
			}
		}

		.buttons {
			margin-top: 2rem;
			display: flex;

			:global(> *) {
				margin-right: 0.5rem;
			}

			@include respond-below(xxs) {
				:global(.btn) {
					width: 100%;
					margin-top: 2rem;
				}
			}
		}
	}

	.infraction-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: 3rem;
		column-gap: 3rem;

		@include respond-below(xl) {
			grid-template-columns: 1fr;
		}
	}

	.infraction-list {
	}

	.infraction {
		background-color: var(--color-background1);
		border-radius: var(--border-sm);
	}
</style>
