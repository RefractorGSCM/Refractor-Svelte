<script lang="ts">
	export let id: string = ""
	export let background: string = "2"
	export let style: string = ""
</script>

<div class={`container bg--${background}`} {id} {style}>
	<slot />
</div>

<style lang="scss">
	@import "../../../mixins/mixins";

	.container {
		margin-bottom: 3rem;
		display: flex;
		font-size: 1.8rem;
		max-height: inherit;
		height: 100%;
		padding: 2rem;
		background-color: var(--color-background2);
		border-radius: var(--border-md);
		width: 100%;
		overflow-y: scroll;

		@include respond-below(lg) {
			font-size: 1.6rem;
		}

		@include respond-below(sm) {
			flex-direction: column;
		}
	}

	.bg {
		&--1 {
			background: var(--color-background1);
		}

		&--2 {
			background: var(--color-background2);
		}

		&--3 {
			background: var(--color-background3);
		}
	}
</style>
