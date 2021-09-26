<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let name = "toggle"
	export let value = "unset"
	export let disabled = false

	if (value !== "unset" && value !== "true" && value !== "false") {
		value = "unset"
	}

	const dispatch = createEventDispatcher()

	const change = (e) => {
		dispatch("change", e)
	}
</script>

<div class="triple-toggle">
	<input
		bind:group={value}
		id={`${name}-tt-no`}
		type="radio"
		{disabled}
		{name}
		value="false"
		on:change={change}
	/>
	<label class="toggle toggle-no" for={`${name}-tt-no`}>
		<i class="fas fa-times" />
	</label>

	<input
		bind:group={value}
		id={`${name}-tt-unset`}
		type="radio"
		{disabled}
		{name}
		value="unset"
		on:change={change}
	/>
	<label class="toggle toggle-unset" for={`${name}-tt-unset`}>
		<i class="fas fa-asterisk" />
	</label>

	<input
		bind:group={value}
		id={`${name}-tt-yes`}
		type="radio"
		{disabled}
		{name}
		value="true"
		on:change={change}
	/>
	<label class="toggle toggle-yes" for={`${name}-tt-yes`}>
		<i class="fas fa-check" />
	</label>
	<span />
</div>

<style lang="scss" global>
	@use "sass:math";

	$option-width: 3rem;
	$option-height: 3rem;

	.triple-toggle {
		display: inline-block;
		border-radius: var(--border-sm);
		position: relative;
		background: var(--color-background3);
		user-select: none;
		max-height: $option-height;

		label {
			text-align: center;
			font-family: sans-serif;
			display: inline-block;
			position: relative;
			z-index: 2;
			margin: 0;
			text-align: center;
			font-size: 1.5rem;
			transition: color 0.3s ease-in-out;
			background: none;

			i {
				width: $option-width;
				height: $option-height;
				cursor: pointer;
				display: grid;
				place-items: center;
			}
		}

		input {
			position: absolute;
			z-index: 3;
			opacity: 0;
			cursor: pointer;
		}

		span {
			height: $option-height;
			width: $option-width;
			line-height: 2.5rem;
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			transition: all 0.3s ease-in-out;
			border-radius: var(--border-sm);
			// background: var(--color-danger);
		}

		input[value="false"] ~ label {
			color: var(--color-danger);
		}

		input[value="unset"] ~ label {
			color: var(--color-text-muted);
		}

		input[value="true"] ~ label {
			color: var(--color-success);
		}

		input[value="false"]:checked ~ span {
			background: var(--color-danger);
			left: 0;
		}

		input[value="true"]:checked ~ span {
			background: var(--color-success);
			left: calc(100% - #{$option-width});
		}

		input[value="unset"]:checked ~ span {
			background: var(--color-accent);
			left: calc(50% - #{math.div($option-width, 2)});
		}

		input[value="unset"]:checked + label {
			color: var(--color-text-muted);
		}

		input[value="false"]:checked + label,
		input[value="true"]:checked + label {
			color: var(--color-text1);
		}
	}
</style>
