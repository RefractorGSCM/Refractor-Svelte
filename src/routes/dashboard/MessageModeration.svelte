<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"

	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import PlayerModal from "../../components/Modals/PlayerModal.svelte"
	import PlatformSelector from "../../components/PlatformSelector.svelte"
	import Spinner from "../../components/Spinner.svelte"
	import type { ChatMessage } from "../../domain/chat/chat.types"
	import { getRecentFlaggedMessages } from "../../domain/chat/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import type { Player } from "../../domain/player/player.types"
	import { getPlayer } from "../../domain/player/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	let message = writable(null as ChatMessage)
	onMount(async () => {
		setLoading("messagemoderation", true)
		const msgArr = await getRecentFlaggedMessages(1)
		const msg = msgArr[0]
		message.set(msg)
		setLoading("messagemoderation", false)
	})
</script>

<Container>
	<div class="title">
		<Heading type="title">Message Moderation</Heading>
	</div>

	<SinglePane>
		<p>
			This page is used to moderate flagged chat messages. One will be presented
			to you and then you can decide to either unflag it or do a moderation
			action because of it.
		</p>
	</SinglePane>

	<SinglePane>
		<div class="messages">
			{#if $loading["messagemoderation"] || !$message}
				<Spinner />
			{:else}
				<div class="message">
					<div class="player"><span>Sent by:</span> {$message.name}</div>
					<div class="text">
						{$message.message}
					</div>
					<div class="buttons">
						<Button color="primary">Unflag</Button>

						<PlayerModal
							player={{
								id: $message.player_id,
								platform: $message.platform,
								name: $message.name,
							}}
						>
							<div slot="trigger" let:open>
								<Button color="warning" on:click={open}>Moderate</Button>
							</div>
						</PlayerModal>
					</div>
				</div>
			{/if}
		</div>
	</SinglePane>
</Container>

<style lang="scss">
	@import "../../mixins/mixins.scss";

	.title {
		margin-bottom: 2rem;
	}

	.messages {
		min-height: 20rem;
		width: 100%;

		.message {
			display: flex;
			flex-direction: column;

			.player {
				padding: 1rem;

				span {
					font-weight: bold;
				}
			}

			.text {
				padding: 1rem;
				min-height: 15rem;
				max-height: 15rem;
				overflow-y: scroll;
				flex: 1;
				background-color: var(--color-background2-dark);
				border: 1px solid var(--color-background3);
				border-radius: var(--border-sm);
			}

			.buttons {
				display: flex;
				justify-content: space-between;
				margin-top: 1rem;

				:global(.btn) {
					min-width: 10rem;
				}

				@include respond-below(sm) {
					:global(.btn) {
						width: 100%;
					}

					:global(.btn:first-child) {
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
					}

					:global(.btn:last-child) {
						border-top-left-radius: 0;
						border-bottom-left-radius: 0;
					}
				}

				@include respond-below(xs) {
					flex-direction: column;
				}
			}
		}
	}
</style>
