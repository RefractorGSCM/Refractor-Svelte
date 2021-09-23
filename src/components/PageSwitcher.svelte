<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let prevText = "Prev"
	export let nextText = "Next"
	export let prevDisabled = true
	export let nextDisabled = true
	export let page = 1

	const dispatch = createEventDispatcher()

	function onPrevClick() {
		if (prevDisabled) return

		dispatch("prev:click")
	}

	function onNextClick() {
		if (nextDisabled) return

		dispatch("next:click")
	}
</script>

<div class="page-switcher">
	<div class="prev" class:disabled={prevDisabled} on:click={onPrevClick}>
		{prevText}
	</div>
	<div class="page">{page}</div>
	<div class="next" class:disabled={nextDisabled} on:click={onNextClick}>
		{nextText}
	</div>
</div>

<style lang="scss">
	.page-switcher {
		width: 100%;
		height: 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.6rem;
		user-select: none;

		.next,
		.prev {
			padding: 0 1rem;
			color: var(--color-primary-light);
			cursor: pointer;
		}

		.next.disabled,
		.prev.disabled {
			color: var(--color-text-muted);
			cursor: unset;
		}
	}
</style>
