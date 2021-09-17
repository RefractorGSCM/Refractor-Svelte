<script lang="ts">
	import { onMount } from "svelte"

	import { writable } from "svelte/store"
	import Button from "../Button.svelte"
	import Modal from "./Modal.svelte"

	const store = writable({
		values: {},
		errors: {},
	})

	function cleanup() {
		store.set({
			values: {},
			errors: {},
		})
	}

	function search() {
		console.log("search")
	}

	function submit(e, close) {
		console.log("submit")
	}
</script>

<Modal on:close={cleanup} fullWidth>
	<div slot="trigger" let:open>
		<slot name="trigger" openPlayerSelector={open} {open} />
	</div>
	<div slot="header">
		<div class="header">Select a Player</div>
	</div>
	<div slot="content">
		<div class="content">
			<form class="form" on:submit|preventDefault={search}>
				<h1>test</h1>
			</form>
		</div>
	</div>
	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={(e) => submit(e, close)}>Select Player</Button>
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
</style>
