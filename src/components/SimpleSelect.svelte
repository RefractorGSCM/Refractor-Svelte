<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let name

	const dispatch = createEventDispatcher()

	function notifyChange(e) {
		dispatch("change", e.target)
	}
</script>

<div class="select-wrapper">
	<select class="select" {name} on:blur={notifyChange} on:change={notifyChange}>
		<slot />
	</select>
</div>

<style lang="scss">
	.select-wrapper {
		height: 100%;
		width: 100%;
		font-size: inherit;
	}

	.select {
		font-size: inherit;
		height: 100%;
		width: 100%;
		border: none;
		background: none;
		color: var(--color-text2);
		border-bottom: 2px solid var(--color-primary);
	}
</style>
