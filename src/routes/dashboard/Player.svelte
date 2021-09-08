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

	function truncate(value: string, limit: number): string {
		if (value.length <= limit) {
			return value
		}

		return value.substring(0, limit - 3) + "..."
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

				<div class="infraction-lists">
					<div class="section">
						<div class="section-heading">
							<Heading>Warnings</Heading>
						</div>

						<div class="list">
							<div class="infraction">
								<div class="field id">
									<span class="label">ID</span>
									<span class="value">1</span>
								</div>
								<div class="field issuer">
									<span class="label">Issuer</span>
									<span class="value">Void</span>
								</div>
								<div class="field date">
									<span class="label">Date</span>
									<span class="value">2020-09-05</span>
								</div>
								<div class="field duration">
									<span class="label">Duration</span>
									<span class="value">1440</span>
								</div>
								<div class="field reason">
									<span class="label">Reason</span>
									<span class="value"
										>{truncate(
											"Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae deserunt, sint aut omnis tempore ratione dignissimos soluta corrupti quam fugiat ut est neque dolore possimus minima voluptatibus facere temporibus hic",
											100,
										)}</span
									>
								</div>
							</div>
						</div>
					</div>

					<div class="section">
						<div class="section-heading">
							<Heading>Mutes</Heading>
						</div>

						<div class="list">
							<div class="infraction">Test 1</div>
							<div class="infraction">Test 2</div>
							<div class="infraction">Test 3</div>
							<div class="infraction">Test 1</div>
						</div>
					</div>

					<div class="section">
						<div class="section-heading">
							<Heading>Kicks</Heading>
						</div>

						<div class="list">
							<div class="infraction">Test 1</div>
							<div class="infraction">Test 2</div>
							<div class="infraction">Test 3</div>
							<div class="infraction">Test 1</div>
						</div>
					</div>

					<div class="section">
						<div class="section-heading">
							<Heading>Bans</Heading>
						</div>

						<div class="list">
							<div class="infraction">Test 1</div>
							<div class="infraction">Test 2</div>
							<div class="infraction">Test 3</div>
							<div class="infraction">Test 1</div>
						</div>
					</div>
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

		.infraction-lists {
			display: grid;
			grid-template-columns: 1fr 1fr;
			column-gap: 3rem;
			row-gap: 3rem;

			@include respond-below(lg) {
				grid-template-columns: 1fr;
			}
		}

		.section {
			display: flex;
			flex-direction: column;
			border: 2px solid var(--color-accent);

			.section-heading {
				padding: 1rem;
			}
		}

		.infraction {
			padding: 1rem;
			position: relative;

			&:nth-child(odd) {
				background-color: var(--color-background1);
			}

			&:nth-child(even) {
				background-color: var(--color-background2);
			}

			display: grid;
			grid-template-columns: 1fr 2fr 2fr 1fr;
			grid-template-rows: auto auto;

			.field {
				position: relative;
				min-height: 3.5rem;

				@include respond-below(xl) {
					min-height: 3rem;
				}

				.label {
					font-size: 1rem;
					color: var(--color-primary-light);
					position: absolute;
					top: 0;
					height: 1rem;
				}

				.value {
					position: absolute;
					bottom: 0;
				}
			}

			.field.reason {
				margin-top: 1rem;
				grid-column: span 4;
				display: flex;
				flex-direction: column;
				width: 100%;

				.label {
					height: 1.5rem;
					position: unset;
				}

				.value {
					position: unset;
					min-height: 4rem;
					overflow: hidden;
					text-overflow: clip;
				}
			}
		}
	}
</style>
