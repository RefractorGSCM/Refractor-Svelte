<script lang="ts">
	import { createEventDispatcher } from "svelte"

	import Button from "../Button.svelte"
	import Modal from "./Modal.svelte"

	export let heading = ""
	export let message = "Are you sure?"

	const dispatch = createEventDispatcher()

	function submit() {
		dispatch("submit")
	}
</script>

<Modal>
	<div slot="trigger" let:open>
		<slot name="trigger" {open} />
	</div>
	<div slot="header">
		<div class="header">
			{heading}
		</div>
	</div>
	<div slot="content">
		<div class="content">
			{message}
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button on:click={close}>Cancel</Button>
		<Button color="danger" on:click={close} on:click={submit}>Delete</Button>
	</div>
</Modal>

<style lang="scss">
	@import "../../mixins/mixins";

	.buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1rem;
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

		@include respond-below(sm) {
			min-width: 100%;
			width: 100%;
		}
	}
</style>
