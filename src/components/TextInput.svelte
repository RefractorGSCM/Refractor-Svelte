<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let name = ""
	export let value = ""
	export let title = ""
	export let placeholder = ""
	export let icon = ""
	export let error: string
	export let inputStyle = "normal"

	const inputStyles = {
		normal: "wrapper-style-normal",
		inline: "wrapper-style-inline",
	}

	const hasIcon = !!icon

	const dispatch = createEventDispatcher()

	function handleChange(e) {
		dispatch("change", e)
	}

	$: console.log(error)
</script>

<div class={`text-input-wrapper ${inputStyles[inputStyle]}`}>
	<div class="title">{title}</div>

	<div class="input-main">
		{#if hasIcon}
			<div class="icon-box">
				<span class={`fas fa-${icon}`} />
			</div>
		{:else}
			<div class="spacer" />
		{/if}

		<input
			class="input"
			{name}
			{placeholder}
			on:input={handleChange}
			bind:value
		/>
	</div>

	<div class="error">{error ? error : ""}</div>
</div>

<style lang="scss" global>
	.text-input-wrapper {
		display: flex;
		flex-direction: column;
		position: relative;
		height: 7rem;

		.error {
			color: var(--color-danger);
			font-size: 1.2rem;
			padding: 0 0.5rem;
			height: 2rem;
		}

		.title {
			font-size: 1rem;
			color: var(--color-primary);
			position: absolute;
			top: -0.6rem;
			left: 0.6rem;
			background-color: var(--color-background2);
		}

		.input-main {
			display: flex;
			border: 1px solid var(--color-primary);
			border-radius: var(--border-sm);

			&:active {
				outline: 1px solid var(--color-primary);
			}
		}

		.spacer {
			padding-left: 1.5rem;
		}

		.input {
			width: 100%;
			background: none;
			border: none;
			outline: none;
			font-size: 1.6rem;
			color: var(--color-text2);
			height: 5rem;
		}

		.icon-box {
			width: 5rem;
			display: flex;
			align-items: center;
			padding: 0 0.8rem;

			span {
				width: 2rem;
				height: 2rem;
				color: var(--color-primary);
			}
		}
	}

	.wrapper-style-inline {
		height: 6rem;

		.input-main {
			height: 4rem;
			border: none;
			border-radius: 0;
			border-bottom: 2px solid var(--color-primary);
			padding: 0 1rem;
		}

		.error {
			height: 2rem;
		}

		.spacer {
			display: none;
		}
	}
</style>
