<script lang="ts" context="module">
	const types = {
		default: {
			class: "heading-default",
			level: 1, // the html heading tag level. 1 would be h1, 2 would be h2 etc
		},
		title: {
			class: "heading-title",
			level: 1,
		},
		subtitle: {
			class: "heading-subtitle",
			level: 2,
		},
	}
</script>

<script lang="ts">
	export let type = "default"

	const typeData = types[type]
</script>

{#if typeData.level === 1}
	<h1 class={typeData.class}><slot /></h1>
{:else if typeData.level === 2}
	<h2 class={typeData.class}><slot /></h2>
{:else if typeData.level === 3}
	<h3 class={typeData.class}><slot /></h3>
{:else if typeData.level === 4}
	<h4 class={typeData.class}><slot /></h4>
{:else if typeData.level === 5}
	<h5 class={typeData.class}><slot /></h5>
{:else if typeData.level === 6}
	<h6 class={typeData.class}><slot /></h6>
{/if}

<style lang="scss">
	@import "../mixins/mixins";

	.heading {
		&-default {
			font-size: clamp(2rem, 1.5vw, 2.8rem);
		}

		&-title {
			font-size: clamp(3.5rem, 3vw, 4.2rem);
		}

		&-subtitle {
			font-size: clamp(2.5rem, 2vw, 3.4rem);
		}
	}
</style>
