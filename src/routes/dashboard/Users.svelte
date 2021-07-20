<script lang="ts">
	import Container from "./components/Container.svelte"
	import Heading from "../../components/Heading.svelte"
	import DualPane from "./components/DualPane.svelte"
</script>

<Container>
	<Heading type="title">Users</Heading>
	<DualPane>
		<div slot="left-pane" />

		<div slot="right-pane" />
	</DualPane>
</Container>

<style lang="scss">
	.test {
	}
</style>
