<script lang="ts">
	export let id: string = ""
</script>

<div class="container" {id}>
	<slot />
</div>

<style lang="scss">
	@import "../../../mixins/mixins";

	.container {
		margin-bottom: 3rem;
		display: flex;
		font-size: 1.8rem;
		min-height: 10vh;
		max-height: inherit;
		height: 100%;
		padding: 2rem;
		background-color: var(--color-background2);
		border-radius: var(--border-md);
		width: 100%;

		@include respond-below(lg) {
			font-size: 1.6rem;
		}

		@include respond-below(sm) {
			flex-direction: column;
		}
	}
</style>
