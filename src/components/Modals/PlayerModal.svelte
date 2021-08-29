<script lang="ts">
	import { navigate } from "svelte-routing"

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
			display: grid;
			grid-template-columns: 1fr 1fr;
			row-gap: 0.5rem;
			column-gap: 0.5rem;

			.profile {
				grid-column: span 2;
				margin-bottom: 1rem;
			}

			:global(.btn) {
				width: 100%;
			}
		}
	}
</style>
