<script lang="ts">
	export let id: string = ""
</script>

<div class="container" {id}>
	<div class="left">
		<slot name="left-pane">
			<p>Left Pane</p>
		</slot>
	</div>

	<div class="right">
		<slot name="right-pane">
			<p>Right Pane</p>
		</slot>
	</div>
</div>

<style lang="scss">
	@import "../../../mixins/mixins";

	.container {
		margin-top: 2rem;
		margin-bottom: 6rem;
		display: grid;
		grid-template-columns: minmax(25rem, 1fr) 4fr;
		grid-column-gap: 2rem;
		font-size: 1.8rem;
		min-height: 70vh;
		max-height: 100vh;

		@include respond-below(lg) {
			font-size: 1.6rem;
		}

		> * {
			padding: 2rem;
			background-color: var(--color-background2);
			border-radius: var(--border-md);
			width: 100%;
			height: 100%;
		}

		@include respond-below(sm) {
			grid-template-rows: 30vh auto;
			grid-template-columns: auto;
			grid-row-gap: 2rem;
		}
	}
</style>
