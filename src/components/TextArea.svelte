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
	export let minRows = 1
	export let maxRows: any = false

	$: minHeight = `${1 + minRows * 2}rem`
	$: maxHeight = maxRows ? `${1 + maxRows * 2}rem` : `auto`

	function updateValue(e) {
		const target: HTMLTextAreaElement = e.target
		value = target.value
	}
</script>

<div class="input-wrapper">
	<div class="input-main" class:error={!!error}>
		<pre
			aria-hidden="true"
			style="min-height: {minHeight}; max-height: {maxHeight};">{value + '\n'}</pre>
		<textarea
			bind:this={ref}
			bind:value
			{disabled}
			{autocomplete}
			{name}
			id="ta-i-{name}"
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
		<label for="ta-i-{name}">{label}</label>
	</div>

	<div class="error-text">{error ? error : ""}</div>
</div>

<style lang="scss">
	.input-wrapper {
		width: 100%;
		margin-top: 1.5rem;
	}

	.input-main {
		position: relative;
		display: grid;
	}

	pre,
	textarea {
		max-width: 100%;
		grid-area: 1 / 1 / 2 / 2;
		font-family: inherit;
		box-sizing: border-box;
		line-height: 2rem;
		overflow: hidden;
		overflow-y: scroll;
		resize: vertical;
		white-space: pre-line;
		word-wrap: normal;
		word-break: break-all;
		outline: none;
		border: none;
		color: var(--color-text2);
		background: var(--color-background1);
		border-bottom: 2px solid var(--color-primary);
	}

	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}

	textarea:focus ~ label,
	textarea:valid ~ label {
		// transform: translateY(-2rem);
		bottom: calc(100% + 0.5rem);
		font-size: 1.2rem;
		color: var(--color-primary-light);
	}

	label {
		position: absolute;
		bottom: calc(50% - 1rem);
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
		bottom: 0;
	}

	textarea:focus ~ .underline::before,
	textarea:valid ~ .underline::before {
		transform: scaleX(1);
	}

	.input-main.error {
		textarea {
			border-bottom: 2px solid var(--color-danger);
		}

		label {
			color: var(--color-text-muted) !important;
		}

		.underline::before {
			background: var(--color-danger);
		}
	}

	.error-text {
		height: 2rem;
		color: var(--color-danger);
		font-size: 1.2rem;
		padding-top: 0.5rem;
	}
</style>
