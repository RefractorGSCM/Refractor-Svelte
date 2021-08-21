<script lang="ts">
	import { onMount } from "svelte"
	import { Route, Router } from "svelte-routing"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import type { Server } from "../../domain/server/server.types"
	import {
		allServers,
		getAllServers,
		getServerById,
	} from "../../domain/server/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
	import ServerGroups from "./ServerGroups.svelte"

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
							<span>Players:</span>10
						</div>
						<div class="status__item">
							<span>Status:</span>Online
						</div>
						<div class="status__item hm">
							<span>Address:</span>127.0.0.1
						</div>
					</div>
				</div>
			</SinglePane>

			<SinglePane>
				<div class="players">
					<Heading type="subtitle">Players</Heading>

					<div class="list">
						<div class="player">Player 1</div>
						<div class="player">Player 2</div>
						<div class="player">Player 3</div>
						<div class="player">Player 4</div>
						<div class="player">Player 5</div>
						<div class="player">Player 6</div>
						<div class="player">Player 7</div>
						<div class="player">Player 8</div>
						<div class="player">Player 9</div>
						<div class="player">Player 10</div>
						<div class="player">Player 11</div>
						<div class="player">Player 12</div>
						<div class="player">Player 13</div>
						<div class="player">Player 14</div>
						<div class="player">Player 15</div>
						<div class="player">Player 16</div>
						<div class="player">Player 17</div>
						<div class="player">Player 18</div>
						<div class="player">Player 19</div>
						<div class="player">Player 20</div>
						<div class="player">Player 1</div>
						<div class="player">Player 2</div>
						<div class="player">Player 3</div>
						<div class="player">Player 4</div>
						<div class="player">Player 5</div>
						<div class="player">Player 6</div>
						<div class="player">Player 7</div>
						<div class="player">Player 8</div>
						<div class="player">Player 9</div>
						<div class="player">Player 10</div>
						<div class="player">Player 11</div>
						<div class="player">Player 12</div>
						<div class="player">Player 13</div>
						<div class="player">Player 14</div>
						<div class="player">Player 15</div>
						<div class="player">Player 16</div>
						<div class="player">Player 17</div>
						<div class="player">Player 18</div>
						<div class="player">Player 19</div>
						<div class="player">Player 20</div>
						<div class="player">Player 1</div>
						<div class="player">Player 2</div>
						<div class="player">Player 3</div>
						<div class="player">Player 4</div>
						<div class="player">Player 5</div>
						<div class="player">Player 6</div>
						<div class="player">Player 7</div>
						<div class="player">Player 8</div>
						<div class="player">Player 9</div>
						<div class="player">Player 10</div>
						<div class="player">Player 11</div>
						<div class="player">Player 12</div>
						<div class="player">Player 13</div>
						<div class="player">Player 14</div>
						<div class="player">Player 15</div>
						<div class="player">Player 16</div>
						<div class="player">Player 17</div>
						<div class="player">Player 18</div>
						<div class="player">Player 19</div>
						<div class="player">Player 20</div>
						<div class="player">Player 20</div>
						<div class="player">Player 20</div>
						<div class="player">Player 20</div>
						<div class="player">Player 20</div>
					</div>
				</div>
			</SinglePane>
		{/if}
	</div>
</Container>

<style lang="scss">
	@import "../../mixins/mixins";

	.wrapper {
		margin-bottom: 6rem;
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

				&:hover {
					background: var(--color-accent-light);
				}
			}
		}
	}
</style>
