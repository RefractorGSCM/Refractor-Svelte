<script lang="ts">
	import { onMount } from "svelte"
	import { Link, navigate, Route, Router } from "svelte-routing"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import { serverPlayers } from "../../domain/player/store"
	import type { Server } from "../../domain/server/server.types"
	import { allServers, getAllServers } from "../../domain/server/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
	import type { Player } from "../../domain/player/player.types"

	export let id
	let server: Server = null
	let errmsg: string

	onMount(async () => {
		try {
			id = parseInt(id)
		} catch (e) {
			errmsg = "Server not found"
			return
		}

		if ($allServers.length === 0) {
			await getAllServers()
		}

		if (!$serverPlayers[id]) {
			serverPlayers.set({
				...serverPlayers,
				[id]: {},
			})
		}

		let found = false
		for (const s of $allServers) {
			if (s.id === id) {
				found = true
				server = s
			}
		}

		if (!found) {
			errmsg = "Server not found"
		}
	})

	let players: Player[] = []
	$: players = $serverPlayers[id] ? Object.values($serverPlayers[id]) : []
	$: players.push({
		id: "32B352D4448F3C1",
		platform: "playfab",
		name: "avoid",
	})
</script>

<Container>
	<div class="wrapper">
		{#if server === null}
			<Heading type="title">{errmsg}</Heading>
		{:else}
			<SinglePane>
				<div class="heading">
					<Heading type="title">{server.name}</Heading>

					<div class="status">
						<div class="status__item hm">
							<span>Players:</span>{Object.keys($serverPlayers[id]).length}
						</div>
						<div class="status__item">
							<span>Status:</span>Online
						</div>
						<div class="status__item hm">
							<span>Address:</span>{server.address}
						</div>
					</div>

					<div class="buttons">
						<Button>Open Chat</Button>
						<Button
							on:click={() =>
								navigate(`/server/${server.id}/groups`, {
									replace: false,
									state: { serverId: server.id },
								})}>Manage Permissions</Button
						>
					</div>
				</div>
			</SinglePane>

			<SinglePane>
				<div class="players">
					{#if players.length < 1}
						<Heading type="subtitle">No Players Online</Heading>
					{:else}
						<Heading type="subtitle">Online Players</Heading>

						<div class="list">
							{#each players as player}
								<Link
									to={`/player/${player.platform}/${player.id}`}
									replace={false}
								>
									<div class="player">
										{player.name}
									</div>
								</Link>
							{/each}
						</div>
					{/if}
				</div>
			</SinglePane>
		{/if}
	</div>
</Container>

<style lang="scss">
	@import "../../mixins/mixins";

	.wrapper {
		margin-bottom: 6rem;
		margin-top: 3rem;
		overflow-y: scroll;
	}

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

			@include respond-below(xs) {
				.hm {
					display: none;
				}
			}
		}

		.buttons {
			margin-top: 2rem;

			@include respond-below(xxs) {
				:global(.btn) {
					width: 100%;
					margin-top: 0.5rem;
				}
			}
		}
	}

	.players {
		width: 100%;

		.list {
			margin-top: 1rem;
			display: grid;
			width: 100%;
			grid-template-columns: 1fr 1fr 1fr;
			row-gap: 0.5rem;
			column-gap: 0.5rem;

			@include respond-below(lg) {
				grid-template-columns: 1fr 1fr;
			}

			@include respond-below(sm) {
				grid-template-columns: 1fr;
			}

			.player {
				background: var(--color-accent);
				cursor: pointer;
				padding: 0.7rem;
				font-size: 1.5rem;
				border-radius: var(--border-sm);
				color: var(--color-text1);
				text-decoration: none;

				&:hover {
					background: var(--color-accent-light);
				}
			}
		}
	}
</style>
