<div class="bottom-bar">
	<slot />
</div>

<style lang="scss" global>
	@import "../../../mixins/mixins";

	.bottom-bar {
		left: 26rem;
		bottom: 0;
		position: fixed;
		background-color: var(--color-topbar);
		width: calc(100% - 26rem);
		z-index: 0;
	}
</style>
