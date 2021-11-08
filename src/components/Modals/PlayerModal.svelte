<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { navigate } from "svelte-routing"
	import Button from "../Button.svelte"
	import BanModal from "./BanModal.svelte"
	import KickModal from "./KickModal.svelte"
	import Modal from "./Modal.svelte"
	import MuteModal from "./MuteModal.svelte"
	import WarningModal from "./WarningModal.svelte"

	export let player: Player = null
	export let serverId: number = null
	export let linkedChatMessages: number[] = null

	const dispatch = createEventDispatcher()

	function onInfractionCreated(e, close) {
		dispatch("newInfraction", e.detail)
		close()
	}
</script>

<Modal>
	<div slot="trigger" let:open>
		<slot name="trigger" {open} />
	</div>
	<div slot="header">
		<div class="header">
			{player.name}
		</div>
	</div>
	<div slot="content" let:store={{ close }}>
		<div class="content">
			<div class="profile">
				<Button
					on:click={(e) => {
						e.stopPropagation()
						navigate(`/player/${player.platform}/${player.id}`, {
							replace: false,
							state: { platform: player.platform, id: player.id },
						})
					}}>View Player</Button
				>
			</div>

			<WarningModal
				{serverId}
				{player}
				{linkedChatMessages}
				on:submit={(e) => onInfractionCreated(e, close)}
			>
				<div slot="trigger" let:open>
					<Button on:click={open}>Log Warning</Button>
				</div>
			</WarningModal>
			<MuteModal
				{serverId}
				{player}
				{linkedChatMessages}
				on:submit={(e) => onInfractionCreated(e, close)}
			>
				<div slot="trigger" let:open>
					<Button on:click={open}>Log Mute</Button>
				</div>
			</MuteModal>
			<KickModal
				{serverId}
				{player}
				{linkedChatMessages}
				on:submit={(e) => onInfractionCreated(e, close)}
			>
				<div slot="trigger" let:open>
					<Button color="warning" on:click={open}>Log Kick</Button>
				</div>
			</KickModal>
			<BanModal
				{serverId}
				{player}
				{linkedChatMessages}
				on:submit={(e) => onInfractionCreated(e, close)}
			>
				<div slot="trigger" let:open>
					<Button color="danger" on:click={open}>Log Ban</Button>
				</div>
			</BanModal>
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button on:click={close}>Close</Button>
	</div>
</Modal>

<style lang="scss">
	@import "../../mixins/mixins";

	.buttons {
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
		min-width: 40rem;
		max-width: 55rem;
		min-width: 100%;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: 0.5rem;
		column-gap: 0.5rem;

		.profile {
			grid-column: span 2;
			margin-bottom: 2rem;
		}

		:global(.btn) {
			width: 100%;
		}
	}
</style>
