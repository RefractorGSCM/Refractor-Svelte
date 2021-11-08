<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let name
	export let value
	export let showConfirm = true
	export let showDelete = true
	export let disableConfirm = false
	export let disableDelete = false
	export let error = null
	export let placeholder = ""

	const dispatch = createEventDispatcher()
</script>

<div class="input-wrapper">
	<div class="input-main" class:error={!!error}>
		<input type="text" {name} {placeholder} bind:value />

		{#if showConfirm}
			<button
				class="button button-submit"
				class:disabled={disableConfirm}
				on:click={() => dispatch("confirm")}
			>
				<span class="fas fa-check" />
			</button>
		{/if}

		{#if showDelete}
			<button
				class="button button-delete"
				class:disabled={disableDelete}
				on:click={() => dispatch("delete")}
			>
				<span class="fas fa-trash-alt" />
			</button>
		{/if}
	</div>

	<div class="error">
		{#if !!error}
			{error}
		{/if}
	</div>
</div>

<style lang="scss">
	.input-wrapper {
		min-height: 3rem;
	}

	.input-main {
		display: flex;
		width: 100%;
		background-color: var(--color-background1);
		border: 1px solid var(--color-accent);
		border-radius: var(--border-sm);
		height: 3rem;

		&:first-child {
			border-top: 1px solid var(--color-accent);
		}

		&.error {
			border: 1px solid var(--color-danger);
		}

		input {
			background: none;
			border: none;
			width: 100%;
			color: var(--color-text2);
			padding: 0.5rem 1rem;
			font-size: 1.6rem;
			height: 100%;
		}

		.button {
			display: grid;
			place-items: center;
			width: 3rem;
			height: 100%;
			color: var(--color-text-muted);
			font-size: 1.6rem;
			transition: 0.2s all;
			cursor: pointer;
			background: none;
			border: none;

			&-submit {
				border-left: 1px solid var(--color-accent);

				&:hover {
					background-color: var(--color-success);
					color: var(--color-text1);
				}
			}

			&-delete {
				border-top-right-radius: var(--border-sm);
				border-bottom-right-radius: var(--border-sm);

				&:hover {
					background-color: var(--color-danger);
					color: var(--color-text1);
				}
			}
		}

		.button.disabled {
			cursor: unset;

			&:hover {
				background: none;
				color: var(--color-text-muted);
			}
		}
	}

	.error {
		color: var(--color-danger);
		font-size: 1.4rem;
	}
</style>
