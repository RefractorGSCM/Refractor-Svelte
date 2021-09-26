<script lang="ts">
	import { onMount } from "svelte"
	import { Link, navigate, Route, Router } from "svelte-routing"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import { serverPlayers } from "../../domain/player/store"
	import type { Server } from "../../domain/server/server.types"
	import {
		allServers,
		getAllServers,
		getServerPermissions,
	} from "../../domain/server/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
	import type { Player } from "../../domain/player/player.types"
	import PlayerModal from "../../components/Modals/PlayerModal.svelte"
	import RequirePerms from "../../components/RequirePerms.svelte"
	import {
		FLAG_ADMINISTRATOR,
		FLAG_CREATE_BAN,
		FLAG_CREATE_KICK,
		FLAG_CREATE_MUTE,
		FLAG_CREATE_WARNING,
		FLAG_VIEW_PLAYER_RECORDS,
	} from "../../permissions/permissions"
	import BanModal from "../../components/Modals/BanModal.svelte"
	import WarningModal from "../../components/Modals/WarningModal.svelte"
	import MuteModal from "../../components/Modals/MuteModal.svelte"
	import KickModal from "../../components/Modals/KickModal.svelte"
	import PermissionCheck from "../../components/PermissionCheck.svelte"
	import { writable } from "svelte/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import Spinner from "../../components/Spinner.svelte"

	export let id
	let server: Server = null
	let errmsg: string
	let permissions = writable(null as BigInt)

	onMount(async () => {
		setLoading("server", true)

		try {
			id = parseInt(id)
		} catch (e) {
			errmsg = "Server not found"
			setLoading("server", false)
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
				break
			}
		}

		// Get computed user permissions scoped to this server
		const perms = await getServerPermissions(server.id)
		permissions.set(perms)

		if (!found) {
			errmsg = "Server not found"
		}

		setLoading("server", false)
	})

	let players: Player[] = []
	$: players = $serverPlayers[id] ? Object.values($serverPlayers[id]) : []

	let playerSelected = false
	let selectedPlayerId = ""
	function togglePlayerMenu(playerId: string) {
		if (playerSelected && selectedPlayerId !== playerId) {
			const menu = document.getElementById(`pm-${selectedPlayerId}`)
			if (!menu) return
			menu.style.display = "none"
			playerSelected = false
			selectedPlayerId = ""

			return
		}

		const menu = document.getElementById(`pm-${playerId}`)
		if (!menu) return

		if (!menu.style.display || menu.style.display === "none") {
			menu.style.display = "flex"
			playerSelected = true
			selectedPlayerId = playerId
		} else {
			menu.style.display = "none"
			playerSelected = false
			selectedPlayerId = ""
		}
	}
</script>

<Container>
	{#if $loading["server"]}
		<Spinner blocking />
	{/if}

	<div class="wrapper">
		{#if server === null}
			<Heading type="title">{errmsg}</Heading>
		{:else if !$permissions}
			<Heading type="title">Fetching permissions...</Heading>
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
						<RequirePerms allOf={[FLAG_ADMINISTRATOR]}>
							<Button
								on:click={() =>
									navigate(`/server/${server.id}/groups`, {
										replace: false,
										state: { serverId: server.id },
									})}>Manage Permissions</Button
							>
						</RequirePerms>
					</div>
				</div>
			</SinglePane>

			<SinglePane>
				<div class="players">
					{#if players.length < 1}
						<Heading>No Players Online</Heading>
					{:else}
						<Heading>Online Players</Heading>

						<div class="list">
							{#each players as player}
								<!-- begin infraction modal wrapping here to avoid messing with styling and modal positioning -->
								<WarningModal serverId={id} {player}>
									<div slot="trigger" let:openWarning>
										<MuteModal serverId={id} {player}>
											<div slot="trigger" let:openMute>
												<KickModal serverId={id} {player}>
													<div slot="trigger" let:openKick>
														<BanModal serverId={id} {player}>
															<div slot="trigger" let:openBan>
																<!-- for small screens -->
																<div class="mobile-player-wrapper">
																	<PlayerModal {player}>
																		<div slot="trigger" let:open>
																			<div class="player" on:click={open}>
																				{player.name}
																			</div>
																		</div>
																	</PlayerModal>
																</div>

																<!-- for larger screens -->
																<div class="player-wrapper">
																	<div
																		class="player-menu"
																		id={`pm-${player.id}`}
																	>
																		<div
																			class="profile"
																			on:click|self={() =>
																				togglePlayerMenu(player.id)}
																		>
																			<PermissionCheck
																				permissions={$permissions}
																				allOf={[FLAG_VIEW_PLAYER_RECORDS]}
																			>
																				<Button
																					on:click={(e) => {
																						e.stopPropagation()
																						navigate(
																							`/player/${player.platform}/${player.id}`,
																							{
																								replace: false,
																								state: {
																									platform: player.platform,
																									id: player.id,
																								},
																							},
																						)
																					}}>Profile</Button
																				>
																			</PermissionCheck>
																		</div>
																		<div class="buttons">
																			<PermissionCheck
																				permissions={$permissions}
																				allOf={[FLAG_CREATE_WARNING]}
																			>
																				<Button
																					classes={["first"]}
																					on:click={openWarning}>Warn</Button
																				>
																			</PermissionCheck>
																			<PermissionCheck
																				permissions={$permissions}
																				allOf={[FLAG_CREATE_MUTE]}
																			>
																				<Button on:click={openMute}>Mute</Button
																				>
																			</PermissionCheck>
																			<PermissionCheck
																				permissions={$permissions}
																				allOf={[FLAG_CREATE_KICK]}
																			>
																				<Button
																					color="warning"
																					on:click={openKick}>Kick</Button
																				>
																			</PermissionCheck>
																			<PermissionCheck
																				permissions={$permissions}
																				allOf={[FLAG_CREATE_BAN]}
																			>
																				<Button
																					color="danger"
																					on:click={openBan}
																					classes={["last"]}>Ban</Button
																				>
																			</PermissionCheck>
																		</div>
																	</div>
																	<div
																		class="player"
																		class:unfocused={playerSelected &&
																			selectedPlayerId !== player.id}
																		class:focused={playerSelected &&
																			selectedPlayerId === player.id}
																		on:click={() => togglePlayerMenu(player.id)}
																	>
																		{player.name}
																	</div>
																</div>
															</div>
														</BanModal>
													</div>
												</KickModal>
											</div>
										</MuteModal>
									</div>
								</WarningModal>
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
			margin-top: 2rem;
			padding-bottom: 2rem;
			display: grid;
			width: 100%;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			row-gap: 0.5rem;
			column-gap: 0.5rem;

			@include respond-below(xl) {
				grid-template-columns: 1fr 1fr 1fr;
			}

			@include respond-below(lg) {
				grid-template-columns: 1fr 1fr;
			}

			@include respond-below(sm) {
				grid-template-columns: 1fr;
			}

			.mobile-player-wrapper {
				width: 100%;
				display: none;

				&:hover {
					background: var(--color-accent-light);
				}

				.player {
					display: flex;
				}

				@include respond-below(xs) {
					// show mobile player menu on devices which can't accomodate the normal player-wrapper menu.
					display: block;
				}
			}

			.player-wrapper {
				width: 100%;
				position: relative;

				@include respond-below(xs) {
					// hide desktop player-wrapper when on a small device which can't accomodate
					// the player menu.
					display: none;
				}
			}

			.player {
				background-color: var(--color-accent);
				cursor: pointer;
				height: 3rem;
				font-size: 1.5rem;
				border-radius: var(--border-sm);
				color: var(--color-text1);
				text-decoration: none;
				position: relative;
				display: flex;
				align-items: center;
				padding-left: 1rem;
				-webkit-user-select: none;
				-moz-user-select: none;
				user-select: none;

				&:hover {
					background: var(--color-accent-light);
				}
			}

			.player.focused {
				background-color: var(--color-background1);
			}

			.player.unfocused {
				background-color: var(--color-background2);
			}

			.selected {
				background-color: var(--color-primary);
			}
		}
	}

	.player-menu {
		display: none;
		position: absolute;
		width: 100%;

		.profile {
			transform: translateY(0);
			z-index: 1001;
			width: 100%;
			display: flex;
			justify-content: right;
			cursor: pointer;
			height: 3rem;

			:global(.btn) {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				margin: 0;
				width: 25%;
				height: 3rem;
				padding: 0;
			}
		}

		.buttons {
			position: absolute;
			transform: translateY(100%);
			width: 100%;
			height: 3rem;
			z-index: 1000;
			display: flex;

			@include respond-below(xl) {
				transform: translateY(100%);
			}

			:global(.btn) {
				width: 100%;
				border-radius: 0;
				margin: 0;
				height: 3rem;
				padding: 0;
			}

			:global(.btn.first) {
				border-bottom-left-radius: var(--border-sm);
			}

			:global(.btn.last) {
				border-bottom-right-radius: var(--border-sm);
			}
		}
	}
</style>
