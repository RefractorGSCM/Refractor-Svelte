<script lang="ts">
	import type { ChatMessage } from "../../domain/chat/chat.types"
	import { getRecentFlaggedMessages } from "../../domain/chat/store"

	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import Button from "../Button.svelte"
	import Spinner from "../Spinner.svelte"
	import Modal from "./Modal.svelte"
	import { loading, setLoading } from "../../domain/loading/store"

	let message = writable(null as ChatMessage)
	onMount(async () => {
		await getNextMessage()
	})

	async function getNextMessage() {
		// setLoading("nextflaggedmessage", true)
		const messages = await getRecentFlaggedMessages(1)
		console.log("messages", messages[0])
		// setLoading("nextflaggedmessage", false)
	}

	function cleanup() {}
</script>

<Modal on:close={cleanup} fullWidth>
	<div slot="trigger" let:open>
		<slot name="trigger" {open} />
	</div>
	<div slot="header">
		<div class="header">Message Moderation Queue</div>
	</div>
	<div slot="content">
		<div class="content">
			<div class="intro">
				Look at the shown message and determine if it warrants any action. If a
				message appears here, it means that it contains one or more words which
				are flagged.
			</div>

			<div class="queue">
				{#if $loading["nextflaggedmessage"] || !$message}
					<Spinner />
				{:else}
					<div class="player"><span>Sent by:</span>{$message.name}</div>

					<div class="message">{$message.message}</div>

					<div class="queue-buttons">
						<Button color="warning">Moderate</Button>
						<Button color="primary">Unflag</Button>
					</div>
				{/if}
			</div>

			<div class="outro">
				Unflag will remove it from the queue without issuing any punitive
				measures.
			</div>
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="primary" on:click={close}>Close</Button>
	</div>
</Modal>

<style lang="scss">
	@import "../../mixins/mixins";

	.buttons {
		display: grid;
		grid-template-columns: 1fr;
		padding: 0 2rem;
		padding-bottom: 2rem;

		:global(.btn) {
			width: 100%;
		}
	}

	.header {
		padding: 1.2rem 2rem;
		font-size: 2rem;
		border-bottom: 1px solid var(--color-primary);
	}

	.content {
		font-size: 1.4rem;
		padding: 0 2rem;
		padding-top: 2rem;
		margin-bottom: 1rem;
		width: 100%;

		.form {
			margin-top: 1rem;
			display: grid;
			grid-template-columns: 1fr;
			grid-row-gap: 1rem;
		}

		@include respond-below(sm) {
			min-width: 100%;
			width: 100%;
		}
	}

	.queue {
		margin-top: 2rem;
		margin-bottom: 2rem;
		position: relative;

		.player {
			display: flex;
			align-items: center;
			height: 3rem;
			font-size: 1.6rem;

			span {
				font-weight: 500;
				margin-right: 0.5rem;
			}
		}

		.message {
			height: 10rem;
			background-color: var(--color-background2);
			border: 2px solid var(--color-background2-dark);
			border-bottom: 0;
			border-top-left-radius: var(--border-sm);
			border-top-right-radius: var(--border-sm);
			padding: 1rem;
			overflow-y: scroll;
		}

		&-buttons {
			display: flex;

			:global(.btn) {
				flex: 1;
			}

			:global(.btn:first-child) {
				border-top-right-radius: 0;
				border-top-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			:global(.btn:last-child) {
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
	}
</style>
