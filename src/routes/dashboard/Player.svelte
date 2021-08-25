<script lang="ts">
	import { onMount } from "svelte"

	import Heading from "../../components/Heading.svelte"
	import { getPlayer } from "../../domain/player/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let platform: string = ""
	export let id: string = ""
	let errmsg = ""

	onMount(async () => {
		const player = await getPlayer(id, platform)

		if (!player) {
			errmsg = "Player not found"
			return
		}
	})
</script>

<Container>
	{#if errmsg.length > 0}
		<Heading type="subtitle">{errmsg}</Heading>
	{:else}
		<SinglePane>
			<div class="heading">
				<Heading type="title">Player</Heading>
				<div>
					<p>Platform: {platform}</p>
					<p>ID: {id}</p>
				</div>
			</div>
		</SinglePane>
	{/if}
</Container>

<style lang="scss">
	.heading {
		display: flex;
		flex-direction: column;
	}
</style>
