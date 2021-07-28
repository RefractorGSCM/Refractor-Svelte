<script context="module" lang="ts">
	const modalList: HTMLElement[] = []
</script>

<script lang="ts">
	import { noop } from "svelte/internal"

	import Button from "../Button.svelte"
	import { modalStore } from "./Modal.store"

	const store = modalStore(false)
	const { isOpen, open, close } = store

	function keydown(e: KeyboardEvent) {
		e.stopPropagation()

		if (e.key === "Escape") {
			close()
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	// The following commented code is a focus trap. It's disabled because it doesn't play well with
	// input elements and it isn't worth fixing at this time.
	///////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// function transitionEnd(e: TransitionEvent) {
	// 	const node = e.target as HTMLElement
	// 	node.focus()
	// }

	// function modalAction(node: HTMLElement) {
	// 	const retFunc = []

	// 	if (document.body.style.overflow !== "hidden") {
	// 		const original = document.body.style.overflow
	// 		document.body.style.overflow = "hidden"
	// 		retFunc.push(() => {
	// 			document.body.style.overflow = original
	// 		})
	// 	}
	// 	node.addEventListener("keydown", keydown)
	// 	node.addEventListener("transitionend", transitionEnd)
	// 	node.focus()
	// 	modalList.push(node)
	// 	retFunc.push(() => {
	// 		node.removeEventListener("keydown", keydown)
	// 		node.removeEventListener("transitionend", transitionEnd)
	// 		modalList.pop()
	// 		// Optional chaining to guard against empty array.
	// 		modalList[modalList.length - 1]?.focus()
	// 	})
	// 	return {
	// 		destroy: () => retFunc.forEach((fn) => fn()),
	// 	}
	// }

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
		<div class="backdrop" on:click={close} />

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

			<slot name="footer" {store}>
				<!-- footer -->
				<p class="fallback-message">Footer content goes in the "footer" slot</p>
				<Button on:click={close}>Close</Button>
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
