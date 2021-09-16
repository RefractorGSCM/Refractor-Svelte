<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import Button from "../components/Button.svelte"
	import Heading from "../components/Heading.svelte"
	import Select from "../components/Select.svelte"
	import TextInput from "../components/TextInput.svelte"
	import Container from "./dashboard/components/Container.svelte"
	import SinglePane from "./dashboard/components/SinglePane.svelte"

	type formStore = {
		values: {
			term: string
			type: string
			platform?: string
		}
		errors: {
			term?: string
			type?: string
			platform?: string
		}
	}

	type result = {
		id: string
		platform: string
		name: string
	}

	type resultStore = {
		meta: {
			pageLimit: number
			total: number
			page: number
		}
		results: result[]
	}

	const store = writable({
		values: {
			term: "",
			type: "",
			platform: "",
		},
		errors: {
			term: null,
			type: null,
			platform: null,
		},
	} as formStore)

	const results = writable({
		meta: {
			pageLimit: 10,
			total: 43732,
			page: 0,
		},
		results: [
			{
				id: "1",
				platform: "playfab",
				name: "Player 1",
			},
		] as result[],
	} as resultStore)
</script>

<Container>
	<div class="title">
		<Heading type="title">Player Records</Heading>
	</div>

	<SinglePane>
		<div class="search-form">
			<div class="heading">
				<Heading>Search Players</Heading>
			</div>

			<div class="form">
				<div class="main">
					<TextInput name="term" label="Search Term" required />
					<Select
						name="type"
						label="Type"
						required
						bind:value={$store.values.type}
					>
						<option value="name">Name</option>
						<option value="id">ID</option>
					</Select>
					<Select
						name="platform"
						label="Platform"
						bind:value={$store.values.platform}
						disabled={$store.values.type !== "id"}
					>
						<option value="">Select...</option>
						<option value="playfab">PlayFab</option>
						<option value="mojang">Mojang</option>
					</Select>
				</div>

				<div class="button">
					<Button>Search</Button>
				</div>
			</div>
		</div>
	</SinglePane>

	{#if $results.results.length > 0}
		<SinglePane>
			<div class="results">
				<div class="heading">
					<Heading>Found {$results.meta.total} Results</Heading>
				</div>
			</div>
		</SinglePane>
	{/if}
</Container>

<style lang="scss">
	.title {
		margin-bottom: 2rem;
	}

	.search-form {
		width: 100%;

		.heading {
			margin-bottom: 1rem;
		}

		.form {
			width: 100%;
			display: grid;

			.main {
				width: 100%;
				display: grid;
				grid-template-columns: 5fr 1fr 1fr;
				column-gap: 1rem;
			}
		}
	}
</style>
