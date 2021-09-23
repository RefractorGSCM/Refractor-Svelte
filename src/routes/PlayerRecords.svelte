<script lang="ts">
	import { onMount } from "svelte"
	import { Link, navigate } from "svelte-routing"
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
	import * as yup from "yup"
	import { reduceYupErrors } from "../utils/yup"
	import BottomBar from "./dashboard/components/BottomBar.svelte"
	import PlayerSelector from "../components/Modals/PlayerSearchModal.svelte"
	import PageSwitcher from "../components/PageSwitcher.svelte"

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

	const currentSearch = writable({
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

	const schema = yup.object().shape({
		term: yup
			.string()
			.trim()
			.required("Search term is required")
			.min(1, "Must be no less than 1 character in length")
			.max(128, "Must be no more than 128 characters in length"),
		type: yup.string().required("Type is required"),
	})

	async function search() {
		const offset = $searchStore.meta.page * pageLimit

		let values = {
			...$store.values,
		}

		// Validate
		let valid = false
		try {
			values = await schema.validate(values, { abortEarly: false })

			store.set({
				...$store,
				errors: {},
			})

			valid = true
		} catch (err) {
			const errors = reduceYupErrors(err)

			console.log(errors)

			store.set({
				...$store,
				errors,
			})
		}

		if (!valid) {
			return
		}

		// Clear current results
		searchStore.set({
			meta: {
				total: 0,
				page: 0,
			},
			results: [] as PlayerSearchResult[],
		})

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

		currentSearch.set({
			term: body.term,
			type: body.type,
			platform: body.platform,
		})
	}

	async function nextPage() {
		if ($searchStore.meta.page >= $amountOfPages - 1) {
			return
		}

		const nextPage = $searchStore.meta.page + 1

		const body = {
			term: $currentSearch.term,
			type: $currentSearch.type,
			platform: $currentSearch.platform,
			limit: pageLimit,
			offset: nextPage * pageLimit,
		} as PlayerSearchBody

		const { total, results } = await searchPlayers(body)

		searchStore.update((current) => {
			current.meta.total = total
			current.meta.page = nextPage
			current.results = results
			return current
		})
	}

	async function prevPage() {
		if ($searchStore.meta.page <= 0) {
			return
		}

		const prevPage = $searchStore.meta.page - 1

		const body = {
			term: $currentSearch.term,
			type: $currentSearch.type,
			platform: $currentSearch.platform,
			limit: pageLimit,
			offset: prevPage * pageLimit,
		} as PlayerSearchBody

		const { total, results } = await searchPlayers(body)

		searchStore.update((current) => {
			current.meta.total = total
			current.meta.page = prevPage
			current.results = results
			return current
		})
	}

	function dateString(date: Date): string {
		return date.toLocaleString("en-GB", { hour12: true })
	}

	let amountOfPages = writable(0)
	$: amountOfPages.set(Math.ceil($searchStore.meta.total / pageLimit))
	$: console.log("amountOfPages", $amountOfPages)
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

			<form class="form" on:submit|preventDefault={search}>
				<div class="main">
					<TextInput
						name="term"
						label="Search Term"
						bind:value={$store.values.term}
						error={$store.errors.term}
						required
					/>
					<Select
						name="type"
						label="Type"
						required
						bind:value={$store.values.type}
						error={$store.errors.type}
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
			</form>
		</div>
	</SinglePane>

	{#if $searchStore.results.length > 0}
		<div class="results">
			<div class="heading">
				<Heading>Showing {$searchStore.meta.total} Results</Heading>
			</div>

			<div class="list">
				<div class="result heading">
					<div class="name">Name</div>
					<div class="name">Last Seen</div>
					<div class="name">Platform</div>
				</div>
				{#each $searchStore.results as result}
					<a
						class="result"
						href={`/player/${result.platform}/${result.id}`}
						on:click|preventDefault={() =>
							navigate(`/player/${result.platform}/${result.id}`)}
					>
						<div class="name">{result.name}</div>
						<div class="lastseen">{dateString(new Date(result.last_seen))}</div>
						<div class="platform">{result.platform}</div>
					</a>
				{/each}
			</div>
		</div>

		<BottomBar>
			<PageSwitcher
				on:prev:click={prevPage}
				on:next:click={nextPage}
				prevDisabled={$searchStore.meta.page <= 0}
				nextDisabled={$searchStore.meta.page >= $amountOfPages - 1}
				page={$searchStore.meta.page + 1}
			/>
		</BottomBar>
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
		margin-bottom: 3rem;

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
				color: var(--color-text2);

				&:hover {
					background-color: var(--color-background1);
				}
			}

			.heading {
				background-color: var(--color-background1);
			}
		}
	}

	:global(.bottom-bar) {
		background-color: unset !important;
	}
</style>
