<script lang="ts">
	export let style = ""
</script>

<div class="container" {style}>
	<slot />
</div>

<style lang="scss">
	.container {
		padding: 3rem;
		padding-bottom: 0;
		max-height: calc(100vh - 20rem);
		height: 100%;
	}
</style>
