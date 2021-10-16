<script lang="ts">
	export let text
	export let x
	export let y
</script>

<div style="top: {y}px; left: {x}px;">{text}</div>

<style lang="scss">
	div {
		position: absolute;
		border: 1px solid var(--color-accent);
		border-radius: var(--border-sm);
		background-color: var(--color-primary);
		padding: 0.5rem;
		font-size: 1.2rem;
	}
</style>
