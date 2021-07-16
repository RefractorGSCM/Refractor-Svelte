<script lang="ts">
	export let color = "primary"
	export let size = "default"
	export let effects: string[] = []
	export let classes: string[] = []
	export let outline = false

	const extraClasses = classes.join(" ")

	let effectString = ""
	if (effects.length > 0) {
		effectString = `btn-${effects.join(" btn-")}`
	}

	const classString = `btn btn-${color} btn-${size} ${effectString} ${extraClasses} ${
		outline ? "btn-outline" : ""
	}`
</script>

<button class={classString} on:click>
	<slot />
</button>

<style lang="scss" global>
	.btn {
		background: none;
		border: none;
		color: var(--color-text1);
		cursor: pointer;

		// sizes
		&-default {
			padding: 0.8rem 1.6rem;
			border-radius: var(--border-md);
			font-size: 1.4rem;
		}

		&-inline {
			padding: 0.5rem;
			border-radius: var(--border-sm);
			font-size: 1.2rem;

			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
		}

		// colors
		&-primary {
			background-color: var(--color-primary);

			&:hover {
				background-color: var(--color-primary-light);
			}
		}

		&-success {
			background-color: var(--color-success);
			color: var(--color-text3);

			&:hover {
				background-color: var(--color-success-light);
			}
		}

		&-warning {
			background-color: var(--color-warning);

			&:hover {
				background-color: var(--color-warning-light);
			}
		}

		&-danger {
			background-color: var(--color-danger);

			&:hover {
				background-color: var(--color-danger-light);
			}
		}

		&-background {
			background-color: var(--color-background2);

			&:hover {
				background-color: var(--color-background1);
			}
		}

		// effects
		&-translate:hover {
			transform: translateY(-1px);
		}

		&-scale:hover {
			transform: scale(1.05);
		}
	}
</style>
