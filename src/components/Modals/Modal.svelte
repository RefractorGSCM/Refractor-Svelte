<script context="module" lang="ts">
	const modalList: HTMLElement[] = []
</script>

<script lang="ts">
	import { createEventDispatcher, noop } from "svelte/internal"

	import Button from "../Button.svelte"
	import { modalStore } from "./Modal.store"

	const store = modalStore(false)
	const { isOpen, open, close } = store

	const dispatch = createEventDispatcher()

	function preClose() {
		dispatch("close", null)
		close()
	}

	function keydown(e: KeyboardEvent) {
		e.stopPropagation()

		if (e.key === "Escape") {
			preClose()
		}
	}

	function modalAction(node: HTMLElement) {
		noop
	}
</script>

<slot name="trigger" {open}>
	<!-- fallback trigger -->
	<button on:click={open}>Open</button>
</slot>

{#if $isOpen}
	<div class="modal" use:modalAction tabindex="0">
		<div class="backdrop" on:click|stopPropagation={preClose} />

		<div class="content-wrapper">
			<slot name="header" {store}>
				<!-- fallback header -->
				<div>
					<p class="fallback-message">
						Header content goes in the "header" slot
					</p>
				</div>
			</slot>

			<div class="content">
				<!-- content -->
				<slot name="content" {store} />
			</div>

			<slot name="footer" store={{ ...store, close: preClose }}>
				<!-- footer -->
				<p class="fallback-message">Footer content goes in the "footer" slot</p>
				<Button on:click={preClose}>Close</Button>
			</slot>
		</div>
	</div>
{/if}

<style lang="scss">
	@import "../../mixins/mixins";

	div.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 100000;

		display: flex;
		justify-content: center;
		align-items: center;

		div.backdrop {
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.4);

			@include respond-below(sm) {
				background-color: rgba(0, 0, 0, 0.6);
			}
		}

		div.content-wrapper {
			z-index: 10;
			max-width: 70vw;
			border-radius: 0.3rem;
			background-color: var(--color-background1);
			overflow: hidden;
			border-radius: var(--border-md);

			@include respond-below(sm) {
				max-width: 80%;
			}

			@include respond-below(xs) {
				max-width: 90%;
			}
		}

		div.content {
			max-height: 50vh;
			overflow: auto;
			padding-bottom: 2rem;
		}
	}

	.fallback-message {
		font-size: 1.6rem;
		color: red;
	}
</style>
