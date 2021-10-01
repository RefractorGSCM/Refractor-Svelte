<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
	import { allGames, allPlatforms } from "../domain/game/store"

	export let name
	export let error = null
	export let label = name
	export let required = false
	export let value: any = ""
	export let defaultOption: string = null
	export let defaultOptionValue: string = ""
	export let disabled = false

	const dispatch = createEventDispatcher()

	onMount(async () => {
		let initialValue
		if (defaultOption) {
			initialValue = value = defaultOptionValue
		} else {
			initialValue = value = $allPlatforms[0]
		}
		update({ target: { value: initialValue } })
	})

	function update(e) {
		value = e.target.value
		dispatch("change", e.target.value)
	}
</script>

<div class="input-wrapper">
	<div class="input-main" class:error={!!error}>
		<select
			class="select"
			id="pfsel-i-{name}"
			{name}
			{required}
			{disabled}
			{value}
			on:blur={update}
			on:change={update}
		>
			{#if defaultOption}
				<option value={defaultOptionValue}>{defaultOption}</option>
			{/if}

			{#each $allPlatforms as platform}
				<option value={platform}>{platform}</option>
			{/each}
		</select>

		<div class="underline" />
		<label for="pfsel-i-{name}">{label}</label>
	</div>

	<div class="error-text">{error ? error : ""}</div>
</div>

<style lang="scss">
	.input-wrapper {
		height: 6rem;

		.input-main {
			margin-top: 1rem;
			height: 3rem;
			width: 100%;
			position: relative;

			select {
				height: 100%;
				width: 100%;
				border: none;
				background: none;
				border-bottom: 2px solid var(--color-primary);
				line-height: 2rem;
				font-size: 1.7rem;
				outline: none;
				color: var(--color-text2);
			}

			select:focus ~ label,
			select:valid ~ label {
				transform: translateY(-1.8rem);
				font-size: 1.2rem;
				color: var(--color-primary-light);
			}

			label {
				position: absolute;
				bottom: 1rem;
				left: 0;
				font-size: 1.5rem;
				color: var(--color-text-muted);
				pointer-events: none;
				transition: all 0.3s ease;
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
				transform: scaleX(0);
				transform-origin: center;
				transition: transform 0.3s ease;
			}

			select:focus ~ .underline::before,
			select:valid ~ .underline::before {
				transform: scaleX(1);
			}

			&.error {
				select {
					border-bottom: 2px solid var(--color-danger);
				}

				label {
					color: var(--color-text-muted) !important;
				}

				.underline::before {
					background: var(--color-danger);
				}
			}

			// DISABLED STYLING
			select:disabled,
			select:disabled + label {
				cursor: unset;
				color: var(--color-text-muted);
			}

			select:disabled ~ label {
				transform: translateY(-1.8rem);
				font-size: 1.2rem;
			}

			select:disabled {
				color: var(--color-text-muted);
				border-bottom: 2px solid var(--color-accent);
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
