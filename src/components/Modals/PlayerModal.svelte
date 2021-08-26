<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import type { Player } from "../../domain/player/player.types"

	import Button from "../Button.svelte"
	import Modal from "./Modal.svelte"

	export let player: Player = null
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
	<div slot="content">
		<div class="content">
			<Button>Log Warning</Button>
			<Button>Log Mute</Button>
			<Button color="warning">Log Kick</Button>
			<Button color="danger">Log Ban</Button>
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

		@include respond-below(sm) {
			min-width: 100%;
			width: 100%;
		}
	}
</style>
