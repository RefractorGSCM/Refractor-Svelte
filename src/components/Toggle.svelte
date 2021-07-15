<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let name = "toggle"
	export let value = "false"

	if (value !== "true" && value !== "false") {
		value = "false"
	}

	const dispatch = createEventDispatcher()

	const change = (e) => {
		dispatch("change", e.target.value)
	}
</script>

<div class="toggle">
	<input
		bind:group={value}
		id="t-no"
		type="radio"
		{name}
		value="false"
		on:change={change}
	/>
	<label for="t-no">
		<i class="fas fa-times" />
	</label>

	<input
		bind:group={value}
		id="t-yes"
		type="radio"
		{name}
		value="true"
		on:change={change}
	/>
	<label for="t-yes">
		<i class="fas fa-check" />
	</label>
	<span />
</div>

<style lang="scss" global>
	$option-width: 3rem;
	$option-height: 3rem;

	.toggle {
		display: inline-block;
		border-radius: var(--border-sm);
		position: relative;
		background: var(--color-background3);

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

		input[value="false"]:checked + label,
		input[value="true"]:checked + label {
			color: var(--color-text1);
		}
	}
</style>
