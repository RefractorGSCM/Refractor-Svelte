<script lang="ts">
	import { onMount } from "svelte"
	import { Link, navigate } from "svelte-routing"
	import { writable } from "svelte/store"
	import Button from "../../components/Button.svelte"
	import Flair from "../../components/Flair.svelte"

	import Heading from "../../components/Heading.svelte"
	import BanModal from "../../components/Modals/BanModal.svelte"
	import KickModal from "../../components/Modals/KickModal.svelte"
	import MuteModal from "../../components/Modals/MuteModal.svelte"
	import WarningModal from "../../components/Modals/WarningModal.svelte"
	import ServerSelector from "../../components/ServerSelector.svelte"
	import type { Infraction } from "../../domain/infraction/infraction.types"
	import { getPlayerInfractions } from "../../domain/infraction/store"
	import type { Player } from "../../domain/player/player.types"
	import { getPlayer, serverPlayers } from "../../domain/player/store"
	import { truncate } from "../../utils/strings"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let platform: string = ""
	export let id: string = ""
	let errmsg = ""

	let player: Player
	let infractions: Infraction[] = []

	type infractionsMap = {
		warnings: Infraction[]
		mutes: Infraction[]
		kicks: Infraction[]
		bans: Infraction[]
	}

	let keys = {
		WARNING: "warnings",
		MUTE: "mutes",
		KICK: "kicks",
		BAN: "bans",
	}

	let store = writable({
		warnings: [],
		mutes: [],
		kicks: [],
		bans: [],
	} as infractionsMap)

	onMount(async () => {
		player = await getPlayer(id, platform)

		if (!player) {
			errmsg = "Player not found"
			return
		}

		infractions = await getPlayerInfractions(platform, id)

		for (const infraction of infractions) {
			// make sure that type is valid
			if (!$store[keys[infraction.type]]) {
				continue
			}

			store.update((current) => {
				current[keys[infraction.type]].push(infraction)
				return current
			})
		}
	})

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

	function dateString(date: Date): string {
		return date.toLocaleString("en-GB", { hour12: true })
	}

	const anyServerId = -1
	function changeServerFilter(id: number) {
		// If the ID == anyServerId then we don't filter by server and just allow all infractions
		if (id === anyServerId) {
			for (const [type, key] of Object.entries(keys)) {
				const newArr: Infraction[] = []

				for (const infraction of infractions) {
					if (infraction.type !== type) {
						continue
					}

					newArr.push(infraction)
				}

				store.update((current) => {
					current[key] = newArr
					return current
				})
			}
			return
		}

		// Otherwise, limit to server ID
		for (const [type, key] of Object.entries(keys)) {
			const newArr: Infraction[] = []

			for (const infraction of infractions) {
				if (infraction.server_id !== id || infraction.type !== type) {
					continue
				}

				newArr.push(infraction)
			}

			store.update((current) => {
				current[key] = newArr
				return current
			})
		}
	}
</script>

<Container style="max-height: unset;">
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
					<WarningModal {player}>
						<div slot="trigger" let:openWarning>
							<Button on:click={openWarning}>Log Warning</Button>
						</div>
					</WarningModal>

					<MuteModal {player}>
						<div slot="trigger" let:openMute>
							<Button on:click={openMute}>Log Mute</Button>
						</div>
					</MuteModal>

					<KickModal {player}>
						<div slot="trigger" let:openKick>
							<Button color="warning" on:click={openKick}>Log Kick</Button>
						</div>
					</KickModal>

					<BanModal {player}>
						<div slot="trigger" let:openBan>
							<Button color="danger" on:click={openBan}>Log Ban</Button>
						</div>
					</BanModal>
				</div>
			</div>
		</SinglePane>

		<SinglePane style="max-height: unset;">
			<div class="infractions">
				<div class="heading">
					<Heading type="subtitle"
						>Infractions ({$store.warnings.length +
							$store.mutes.length +
							$store.kicks.length +
							$store.bans.length} total)</Heading
					>

					<ServerSelector
						name="serverId"
						defaultOption={{ id: anyServerId, name: "Any" }}
						on:change={({ detail }) => changeServerFilter(detail)}
					/>
				</div>

				<div class="infraction-lists">
					<div class="section">
						<div class="section-heading">
							<Heading
								>{$store.warnings.length > 0
									? "Warnings"
									: "No warnings on record"}</Heading
							>
						</div>

						<div class="list">
							{#each $store.warnings as infraction}
								<a
									class="infraction noduration"
									href={`/infraction/${infraction.id}`}
									on:click|preventDefault={() =>
										navigate(`/infraction/${infraction.id}`)}
								>
									<div class="field id">
										<span class="label">ID</span>
										<span class="value">{infraction.id}</span>
									</div>
									<div class="field issuer">
										<span class="label">Issuer</span>
										<span class="value">{infraction.issuer_name}</span>
									</div>
									<div class="field duration">
										<span class="label">Duration</span>
										<span class="value">{infraction.duration}</span>
									</div>
									<div class="field date">
										<span class="label">Date</span>
										<span class="value">
											{dateString(new Date(infraction.created_at))}
										</span>
									</div>
									<div class="field reason">
										<span class="label">Reason</span>
										<span class="value">{truncate(infraction.reason, 100)}</span
										>
									</div>
								</a>
							{/each}
						</div>
					</div>

					<div class="section">
						<div class="section-heading">
							<Heading
								>{$store.mutes.length > 0
									? "Mutes"
									: "No mutes on record"}</Heading
							>
						</div>

						<div class="list">
							{#each $store.mutes as infraction}
								<a
									class="infraction"
									href={`/infraction/${infraction.id}`}
									on:click|preventDefault={() =>
										navigate(`/infraction/${infraction.id}`)}
								>
									<div class="field id">
										<span class="label">ID</span>
										<span class="value">{infraction.id}</span>
									</div>
									<div class="field issuer">
										<span class="label">Issuer</span>
										<span class="value">{infraction.issuer_name}</span>
									</div>
									<div class="field duration">
										<span class="label">Duration</span>
										<span class="value">{infraction.duration}</span>
									</div>
									<div class="field date">
										<span class="label">Date</span>
										<span class="value">
											{dateString(new Date(infraction.created_at))}
										</span>
									</div>
									<div class="field reason">
										<span class="label">Reason</span>
										<span class="value">{truncate(infraction.reason, 100)}</span
										>
									</div>
								</a>
							{/each}
						</div>
					</div>

					<div class="section">
						<div class="section-heading">
							<Heading
								>{$store.kicks.length > 0
									? "Kicks"
									: "No kicks on record"}</Heading
							>
						</div>

						<div class="list">
							{#each $store.kicks as infraction}
								<a
									class="infraction noduration"
									href={`/infraction/${infraction.id}`}
									on:click|preventDefault={() =>
										navigate(`/infraction/${infraction.id}`)}
								>
									<div class="field id">
										<span class="label">ID</span>
										<span class="value">{infraction.id}</span>
									</div>
									<div class="field issuer">
										<span class="label">Issuer</span>
										<span class="value">{infraction.issuer_name}</span>
									</div>
									<div class="field duration">
										<span class="label">Duration</span>
										<span class="value">{infraction.duration}</span>
									</div>
									<div class="field date">
										<span class="label">Date</span>
										<span class="value">
											{dateString(new Date(infraction.created_at))}
										</span>
									</div>
									<div class="field reason">
										<span class="label">Reason</span>
										<span class="value">{truncate(infraction.reason, 100)}</span
										>
									</div>
								</a>
							{/each}
						</div>
					</div>

					<div class="section">
						<div class="section-heading">
							<Heading
								>{$store.bans.length > 0
									? "Bans"
									: "No bans on record"}</Heading
							>
						</div>

						<div class="list">
							{#each $store.bans as infraction}
								<a
									class="infraction"
									href={`/infraction/${infraction.id}`}
									on:click|preventDefault={() =>
										navigate(`/infraction/${infraction.id}`)}
								>
									<div class="field id">
										<span class="label">ID</span>
										<span class="value">{infraction.id}</span>
									</div>
									<div class="field issuer">
										<span class="label">Issuer</span>
										<span class="value">{infraction.issuer_name}</span>
									</div>
									<div class="field duration">
										<span class="label">Duration</span>
										<span class="value">{infraction.duration}</span>
									</div>
									<div class="field date">
										<span class="label">Date</span>
										<span class="value">
											{dateString(new Date(infraction.created_at))}
										</span>
									</div>
									<div class="field reason">
										<span class="label">Reason</span>
										<span class="value">{truncate(infraction.reason, 100)}</span
										>
									</div>
								</a>
							{/each}
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
		height: 14rem;

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
			column-gap: 1.5rem;
			row-gap: 1.5rem;

			@include respond-below(lg) {
				grid-template-columns: 1fr;
			}
		}

		.section {
			display: flex;
			flex-direction: column;
			border: 2px solid var(--color-accent);
			border-radius: var(--border-sm);

			.section-heading {
				padding: 1rem;
			}
		}

		.infraction {
			padding: 1rem;
			position: relative;
			width: 100%;
			color: var(--color-text2);
			transition: all 0.2s;

			&:nth-child(odd) {
				background-color: var(--color-background1);
			}

			&:nth-child(even) {
				background-color: var(--color-background2);
			}

			&:hover::before {
				content: "";
				display: block;
				position: absolute;
				left: 0;
				top: 0;
				width: 3px;
				height: 100%;
				background-color: var(--color-primary-light);
				margin-left: -3px;
			}

			display: grid;
			grid-template-columns: 1fr 1.5fr 1fr 2.5fr;
			grid-template-rows: auto auto;

			@include respond-below(sm) {
				grid-template-columns: 1fr 1fr 1fr;
				grid-template-rows: auto auto auto;

				.field.reason {
					grid-column: span 2;
				}

				.field.date {
					grid-column: span 2;
				}
			}

			.field {
				position: relative;
				min-height: 3.5rem;

				@include respond-below(xl) {
					min-height: 3rem;
				}

				.label {
					font-size: 1.2rem;
					color: var(--color-primary-light);
					position: absolute;
					top: 0;
					height: 1.2rem;

					@include respond-below(xl) {
						font-size: 1rem;
						height: 1rem;
					}
				}

				.value {
					font-size: 1.4rem;
					position: absolute;
					bottom: 0;

					@include respond-below(xl) {
						min-height: 1.2rem;
					}
				}
			}

			.field.reason {
				margin-top: 0.5rem;
				grid-column: span 4;
				display: flex;
				flex-direction: column;
				width: 100%;

				@include respond-below(sm) {
					grid-column: span 2;
				}

				.label {
					height: 1.3rem;
					position: unset;
				}

				.value {
					position: unset;
					min-height: 2rem;
					overflow: hidden;
					text-overflow: clip;
					font-size: 1.6rem;
				}
			}
		}

		.infraction.noduration {
			grid-template-columns: 1fr 2fr 3fr;

			@include respond-below(sm) {
				grid-template-columns: 1fr 1fr;
			}

			.field.duration {
				display: none;
			}
		}
	}
</style>
