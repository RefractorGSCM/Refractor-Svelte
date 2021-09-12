<script lang="ts">
	import { onMount } from "svelte"
	import Heading from "../../components/Heading.svelte"
	import type { Infraction } from "../../domain/infraction/infraction.types"
	import { getInfractionById } from "../../domain/infraction/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let id

	let infraction: Infraction = null
	onMount(async () => {
		infraction = await getInfractionById(id)
	})
</script>

<Container>
	{#if !infraction}
		<Heading>Infraction not found</Heading>
	{:else}
		<Heading type="title">Infraction {id}</Heading>
	{/if}
</Container>
