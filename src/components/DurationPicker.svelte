<script lang="ts">
	import { createEventDispatcher } from "svelte"

	import Select from "./SimpleSelect.svelte"

	export let name
	export let value: number = 0
	export let label = name
	export let error = null
	export let disabled = false
	export let ref = null
	export let autocomplete = "off"
	export let required = false
	export let min = 0
	export let max = 0x7fffffff
	export let quickselects: { name: string; value: number }[] = null

	const dispatch = createEventDispatcher()

	function updateValue(e) {
		let target = e.target

		if (e.detail) {
			target = e.detail
		}

		value = parseInt(target.value)

		dispatch("change", value)
	}
</script>

<div class="input-wrapper">
	<div class="input-main" class:error={!!error}>
		<input
			type="number"
			bind:this={ref}
			bind:value
			{disabled}
			{autocomplete}
			{name}
			id="dur-i-{name}"
			{required}
			{min}
			{max}
			data-invalid={error || undefined}
			aria-invalid={error || undefined}
			on:change={updateValue}
		/>

		<div class="quickselects">
			<Select name="quickselects" on:change={updateValue}>
				{#each quickselects as option}
					<option value={option.value}>{option.name}</option>
				{/each}
			</Select>
		</div>

		<div class="underline" />
		<label for="dur-i-{name}">{label} (minutes)</label>
	</div>

	<div class="error-text">{error ? error : ""}</div>
</div>

<style lang="scss">
	.input-wrapper {
		height: 6rem;

		.input-main {
			height: 3rem;
			width: 100%;
			position: relative;
			margin-top: 1rem;
			display: grid;
			grid-template-columns: auto 10rem;

			input {
				height: 3rem;
				width: 100%;
				border: none;
				background: none;
				border-bottom: 2px solid var(--color-primary);
				line-height: 2rem;
				font-size: 1.7rem;
				outline: none;
				color: var(--color-text2);
				-webkit-appearance: none;
				-moz-appearance: textfield;
			}

			.quickselects {
				width: 100%;
			}

			input:focus ~ label,
			input:valid ~ label {
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

			input:focus ~ .underline::before,
			input:valid ~ .underline::before {
				transform: scaleX(1);
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
		}

		.error-text {
			height: 2rem;
			color: var(--color-danger);
			font-size: 1.2rem;
			padding-top: 0.5rem;
		}
	}
</style>
