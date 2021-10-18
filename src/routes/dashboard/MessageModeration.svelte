<script lang="ts">
	import { onMount, tick } from "svelte"
	import { writable } from "svelte/store"

	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import PlayerModal from "../../components/Modals/PlayerModal.svelte"
	import PlatformSelector from "../../components/PlatformSelector.svelte"
	import Spinner from "../../components/Spinner.svelte"
	import type { ChatMessage } from "../../domain/chat/chat.types"
	import {
		getRecentFlaggedMessages,
		unflagMessage,
	} from "../../domain/chat/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import type { Player } from "../../domain/player/player.types"
	import { getPlayer } from "../../domain/player/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
	import { fade } from "svelte/transition"
	import sleep from "../../utils/sleep"
	import { Link } from "svelte-routing"

	let message = writable(null as ChatMessage)
	onMount(async () => {
		setLoading("messagemoderation", true)
		const msgArr = await getRecentFlaggedMessages(1)
		const msg = msgArr[0]
		message.set(msg)
		setLoading("messagemoderation", false)
	})

	let hideMessage = false

	async function getNextMessage() {
		await tick()
		hideMessage = true
		const msgArr = await getRecentFlaggedMessages(1)
		const msg = msgArr[0]

		await sleep(750)
		message.set(msg)
		hideMessage = false
	}

	async function unflag() {
		await unflagMessage($message.id)
		await getNextMessage()
	}
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
			{/if}
			{#if $message && !hideMessage}
				<div class="message" transition:fade>
					<div class="player">
						<span>Sent by:</span>
						<Link to={`/player/${$message.platform}/${$message.player_id}`}
							>{$message.name}</Link
						>
					</div>
					<div class="text">
						{$message.message}
					</div>
					<div class="buttons">
						<Button color="primary" on:click={() => unflag()}>Unflag</Button>

						<PlayerModal
							serverId={$message.server_id}
							player={{
								id: $message.player_id,
								platform: $message.platform,
								name: $message.name,
							}}
							linkedChatMessages={[$message.id]}
							on:newInfraction={() => unflag()}
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
		height: 25rem;
		width: 100%;

		.message {
			display: flex;
			flex-direction: column;
			height: 100%;
			flex: 1;

			&.hide {
				display: none;
			}

			.player {
				padding: 1rem;

				:global(a) {
					color: var(--color-text2);
					text-decoration: underline;
				}

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
