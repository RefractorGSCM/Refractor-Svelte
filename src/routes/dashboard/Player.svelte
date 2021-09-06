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
	import ServerSelector from "../../components/ServerSelector.svelte"
	import type { Infraction } from "../../domain/infraction/infraction.types"
	import { getPlayerInfractions } from "../../domain/infraction/store"
	import type { Player } from "../../domain/player/player.types"
	import { getPlayer, serverPlayers } from "../../domain/player/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let platform: string = ""
	export let id: string = ""
	let errmsg = ""

	let player: Player
	let infractions: Infraction[]
	let warnings: Infraction[]
	let mutes: Infraction[]
	let kicks: Infraction[]
	let bans: Infraction[]

	onMount(async () => {
		player = await getPlayer(id, platform)

		if (!player) {
			errmsg = "Player not found"
			return
		}

		infractions = await getPlayerInfractions(platform, id)

		for (const infraction of infractions) {
			switch (infraction.type) {
				case "WARNING":
					warnings.push(infraction)
					break
				case "MUTE":
					mutes.push(infraction)
					break
				case "KICK":
					kicks.push(infraction)
					break
				case "BAN":
					bans.push(infraction)
					break
			}
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

		<SinglePane>
			<div class="infractions">
				<div class="heading">
					<Heading type="subtitle">Infractions</Heading>

					<ServerSelector name="serverId" />
				</div>

				<div class="section">
					<Heading>Warnings</Heading>
				</div>
			</div>
		</SinglePane>
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

	.infractions {
		width: 100%;

		.heading {
			width: 100%;
			min-height: 11rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.section {
			padding-top: 1rem;
			display: flex;
			flex-direction: column;
		}
	}
</style>
