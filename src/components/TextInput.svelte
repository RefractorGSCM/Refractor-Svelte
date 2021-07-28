<script lang="ts">
	export let name
	export let type = "text"
	export let value = ""
	export let label = name
	export let error = null
	export let disabled = false
	export let ref = null
	export let autocomplete = "off"
	export let required = false

	function updateValue(e) {
		const target: HTMLTextAreaElement = e.target
		value = target.value
	}
</script>

<div class="input-wrapper">
	<div class="input-main" class:error={!!error}>
		<input
			{type}
			bind:this={ref}
			{value}
			{disabled}
			{autocomplete}
			{name}
			id="t-i-{name}"
			{required}
			data-invalid={error || undefined}
			aria-invalid={error || undefined}
			on:change
			on:input
			on:input={updateValue}
			on:keydown
			on:keyup
			on:focus
			on:blur
		/>
		<div class="underline" />
		<label for="t-i-{name}">{label}</label>
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

			input {
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
