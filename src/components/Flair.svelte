<script lang="ts">
	export let color = "primary"
	export let size = "default"
	export let background = ""

	const classString = `flair flair-${color} flair-${size}`
</script>

<div
	class={classString}
	style={background !== "" ? `background: ${background}` : ""}
>
	<slot />
</div>

<style lang="scss" global>
	@import "../mixins/mixins";

	.flair {
		border-radius: var(--border-sm);

		// Sizes
		&-default {
			padding: 0.5rem;
			font-size: 1.2rem;
			display: inline-block;

			@include respond-below(xl) {
				padding: 0.5rem;
				font-size: 1rem;
				display: inline-block;
			}
		}

		// Colors
		&-primary {
			background-color: var(--color-primary);
		}

		&-danger {
			background-color: var(--color-danger);
		}

		&-success {
			background-color: var(--color-success);
		}

		&-disabled {
			background-color: var(--color-disabled);
		}
	}
</style>
