<script>
	// @ts-nocheck

	import { createEventDispatcher } from "svelte"
	import { HsvPicker } from "svelte-color-picker"
	import { hexToDecimal, rgbToHex } from "../../utils/color"
	import Button from "../Button.svelte"
	import Modal from "./Modal.svelte"

	export let color = "cecece"

	let currentColor = ""

	const dispatch = createEventDispatcher()

	function handleColorChange(rgba) {
		const { detail } = rgba
		const hex = rgbToHex(detail.r, detail.g, detail.b)

		currentColor = hexToDecimal(hex)
	}

	function submit() {
		dispatch("submit", currentColor)
	}
</script>

<Modal>
	<div slot="trigger" let:open>
		<slot name="trigger" {open} />
	</div>
	<div slot="header">
		<div class="header">Select Color</div>
	</div>
	<div slot="content">
		<div class="content">
			<HsvPicker startColor={color} on:colorChange={handleColorChange} />
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={close} on:click={submit}>Select</Button>
	</div>
</Modal>

<style lang="scss">
	@import "../../mixins/mixins";

	.buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1rem;
		padding: 0 1rem;
		padding-bottom: 2rem;

		:global(.btn) {
			width: 100%;
		}
	}

	.header {
		padding: 1.2rem 2rem;
		font-size: 2rem;
		text-align: center;
	}

	.content {
		overflow-x: hidden;

		:global(.main-container) {
			background-color: var(--color-background1);
			height: 23rem;
			overflow: hidden;
		}

		:global(.main-container .hex-text-block) {
			background: var(--color-background3);
			border: 1px solid var(--color-accent);
		}

		:global(.main-container .color-picked-bg) {
			border-color: var(--color-background3);
		}

		:global(.main-container .hex-text-block) {
			background: var(--color-background1);
		}

		:global(.main-container .rgb-text-div) {
			height: 5rem;
		}

		:global(.main-container .rgb-text-block) {
			background: var(--color-background1);
			border: 0;
		}

		:global(.main-container .rgb-text-block p) {
			margin-top: 0.8rem;
			font-size: 1rem;
		}

		:global(.main-container .alpha-selector) {
			display: none;
		}
	}
</style>
