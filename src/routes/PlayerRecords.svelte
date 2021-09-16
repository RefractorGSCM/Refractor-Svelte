<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import Button from "../components/Button.svelte"
	import Heading from "../components/Heading.svelte"
	import Select from "../components/Select.svelte"
	import TextInput from "../components/TextInput.svelte"
	import type {
		PlayerSearchBody,
		PlayerSearchResult,
	} from "../domain/search/search.types"
	import { searchPlayers } from "../domain/search/store"
	import Container from "./dashboard/components/Container.svelte"
	import SinglePane from "./dashboard/components/SinglePane.svelte"

	const pageLimit = 10

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

	type resultStore = {
		meta: {
			total: number
			page: number
		}
		results: PlayerSearchResult[]
	}

	const store = writable({
		values: {
			term: "",
			type: "name",
			platform: "",
		},
		errors: {
			term: null,
			type: null,
			platform: null,
		},
	} as formStore)

	const previousSearch = writable({
		term: "",
		type: "",
		platform: "",
	})

	const searchStore = writable({
		meta: {
			total: 0,
			page: 0,
		},
		results: [] as PlayerSearchResult[],
	} as resultStore)

	async function search() {
		const offset = $searchStore.meta.page * pageLimit

		const body = {
			term: $store.values.term,
			type: $store.values.type,
			platform: $store.values.platform || undefined,
			limit: pageLimit,
			offset,
		} as PlayerSearchBody

		const { total, results } = await searchPlayers(body)

		searchStore.update((current) => {
			current.meta.total = total
			current.results = results
			return current
		})
	}

	function dateString(date: Date): string {
		return date.toLocaleString("en-GB", { hour12: true })
	}
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
					<TextInput
						name="term"
						label="Search Term"
						bind:value={$store.values.term}
						required
					/>
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
					<Button on:click={search}>Search</Button>
				</div>
			</div>
		</div>
	</SinglePane>

	{#if $searchStore.results.length > 0}
		<div class="results">
			<div class="heading">
				<Heading
					>Showing {$searchStore.meta.total < pageLimit
						? $searchStore.meta.total
						: pageLimit} of {$searchStore.meta.total} Results</Heading
				>
			</div>

			<div class="list">
				<div class="result heading">
					<div class="name">Name</div>
					<div class="name">Last Seen</div>
					<div class="name">Platform</div>
				</div>
				{#each $searchStore.results as result}
					<div class="result">
						<div class="name">{result.name}</div>
						<div class="name">{dateString(new Date(result.last_seen))}</div>
						<div class="name">{result.platform}</div>
					</div>
				{/each}
			</div>
		</div>
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

	.results {
		width: 100%;
		font-size: 1.6rem;

		.list {
			margin-top: 1rem;
			width: 100%;
			display: flex;
			flex-direction: column;

			> * {
				margin-bottom: 0.5rem;
			}

			&:last-child {
				margin-bottom: 0;
			}

			.result {
				width: 100%;
				display: grid;
				grid-template-columns: 2fr 1fr 1fr;
				column-gap: 1rem;
				background-color: var(--color-background2);
				padding: 0.75rem 1.25rem;
				border-radius: var(--border-sm);
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background-color: var(--color-background1);
				}
			}

			.heading {
				background-color: var(--color-background1);
			}
		}
	}
</style>
