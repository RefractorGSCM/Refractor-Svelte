<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
	import PlayerSearchModal from "./Modals/PlayerSearchModal.svelte"

	export let name
	export let label = name
	export let error = null
	export let value: PlayerSearchResult = null
	export let selectText = "Select"
	export let disabled = false

	const dispatch = createEventDispatcher()

	function onChange(player: PlayerSearchResult) {
		if (disabled) return

		value = player

		dispatch("change", player)
	}
</script>

<PlayerSearchModal on:submit={({ detail }) => onChange(detail)}>
	<div slot="trigger" let:open>
		<div class="wrapper">
			<div
				class="main"
				class:error={!!error}
				class:selected={!!value}
				class:disabled={!!disabled}
			>
				<div
					class="player"
					on:click={() => {
						if (!disabled) open()
					}}
				>
					<span>{value?.name || selectText}</span>
					{#if !!value}
						<div
							class="deselect-button"
							on:click={(e) => {
								e.stopPropagation()
								onChange(null)
							}}
						>
							&#10005;
						</div>
					{/if}
				</div>
				<div class="underline" />
				<label for="ps-i-{name}">{label}</label>
			</div>

			<div class="error-text">{error ? error : ""}</div>
		</div>
	</div>
</PlayerSearchModal>

<style lang="scss">
	.wrapper {
		height: 6rem;

		.main {
			margin-top: 1rem;
			height: 3rem;
			width: 100%;
			position: relative;

			.player {
				position: relative;
				height: 100%;
				width: 100%;
				border: none;
				background: none;
				border-bottom: 2px solid var(--color-primary);
				line-height: 2rem;
				font-size: 1.7rem;
				outline: none;
				color: var(--color-text2);
				user-select: none;
				cursor: pointer;

				span {
					position: absolute;
					bottom: calc(50% - 1rem);
				}

				.deselect-button {
					position: absolute;
					top: calc(50% - 1rem);
					right: 0.5rem;
					font-size: 1.4rem;
					height: 2rem;
					width: 2rem;
					background-color: var(--color-accent);
					border-radius: var(--border-sm);
					display: grid;
					place-items: center;
					cursor: pointer;
				}
			}

			label {
				position: absolute;
				bottom: 1rem;
				left: 0;
				color: var(--color-text-muted);
				pointer-events: none;
				transition: all 0.3s ease;
				transform: translateY(-1.8rem);
				font-size: 1.2rem;
				color: var(--color-primary-light);
			}

			.underline {
				position: absolute;
				bottom: 0;
				height: 2px;
				width: 100%;
			}

			.underline::before {
				position: absolute;
				content: "";
				width: 100%;
				height: 100%;
				background: var(--color-primary-light);
				transform-origin: center;
				transition: transform 0.3s ease;
			}

			&.error {
				input {
					border-bottom: 2px solid var(--color-danger);
				}

				label {
					color: var(--color-text-muted) !important;
				}

				.underline::before {
					background: var(--color-danger);
				}
			}

			&.selected {
				.player {
					cursor: unset;
				}
			}

			&.disabled {
				label {
					color: var(--color-text-muted);
					transform: translateY(-1.8rem);
					font-size: 1.2rem;
				}

				.player {
					color: var(--color-text-muted);
					border-bottom: 2px solid var(--color-disabled);
					cursor: unset;
				}

				.underline,
				.underline::before {
					background: var(--color-disabled);
				}
			}
		}

		.error-text {
			height: 2rem;
			color: var(--color-danger);
			font-size: 1.2rem;
			padding-top: 0.5rem;
		}
	}
</style>
