<script lang="ts">
	export let name
	export let value = ""
	export let label = name
	export let error = null
	export let disabled = false
	export let required = false

	function onChange(e) {
		value = e.target.value
	}
</script>

<div class="select-wrapper">
	<div class="select-main">
		<select
			{name}
			{value}
			{required}
			{disabled}
			on:blur={onChange}
			on:change={onChange}
		>
			<slot />
		</select>
		<div class="underline" />
		<label for="s-i-{name}">{label}</label>
	</div>

	<div class="error-text">{error ? error : ""}</div>
</div>

<style lang="scss">
	.select-wrapper {
		height: 6rem;

		.select-main {
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
				padding: 0;
				margin: 0;
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
