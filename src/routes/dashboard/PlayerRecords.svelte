<script lang="ts">
	import { navigate } from "svelte-routing"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import PageSwitcher from "../../components/PageSwitcher.svelte"
	import Select from "../../components/Select.svelte"
	import TextInput from "../../components/TextInput.svelte"
	import { searchPlayers } from "../../domain/search/store"
	import { dateString } from "../../utils/date"
	import { reduceYupErrors } from "../../utils/yup"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

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
			wasRun: boolean
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
			wasRun: false,
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
				wasRun: false,
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
			current.meta.wasRun = true
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

	let amountOfPages = writable(0)
	$: amountOfPages.set(Math.ceil($searchStore.meta.total / pageLimit))
</script>

<svelte:head>
	<title>Refractor - Player Records</title>
</svelte:head>

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

	{#if $searchStore.results?.length > 0}
		<div class="results">
			<div class="heading">
				<Heading>Showing {$searchStore.meta.total} Results</Heading>
			</div>

			<div class="top-switcher">
				<PageSwitcher
					on:prev:click={prevPage}
					on:next:click={nextPage}
					prevDisabled={$searchStore.meta.page <= 0}
					nextDisabled={$searchStore.meta.page >= $amountOfPages - 1}
					page={$searchStore.meta.page + 1}
				/>
			</div>

			<div class="list">
				<div class="result heading">
					<div class="name">Name</div>
					<div class="lastseen">Last Seen</div>
					<div class="platform">Platform</div>
				</div>
				{#each $searchStore.results as result}
					<a
						class="result"
						href={`/player/${result.platform}/${result.id}`}
						on:click|preventDefault={() =>
							navigate(`/player/${result.platform}/${result.id}`)}
					>
						<div class="name">
							<span class="mobile-label">Name: </span>{result.name}
						</div>
						<div class="lastseen">
							<span class="mobile-label">Date: </span><span class="date">
								{dateString(new Date(result.last_seen)).split(",")[0]}
							</span>
							<span class="time">
								{dateString(new Date(result.last_seen)).split(",")[1]}
							</span>
						</div>
						<div class="platform">
							<span class="mobile-label">Platform: </span>{result.platform}
						</div>
					</a>
				{/each}
			</div>

			<div class="bottom-switcher">
				<PageSwitcher
					on:prev:click={prevPage}
					on:next:click={nextPage}
					prevDisabled={$searchStore.meta.page <= 0}
					nextDisabled={$searchStore.meta.page >= $amountOfPages - 1}
					page={$searchStore.meta.page + 1}
				/>
			</div>
		</div>
	{:else if $searchStore.meta.wasRun && (!$searchStore.results || $searchStore.results.length < 1)}
		<Heading>No results found</Heading>
	{/if}
</Container>

<style lang="scss">
	@import "../../mixins/mixins";

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

				@include respond-below(sm) {
					grid-template-columns: unset;
					grid-template-rows: 1fr 1fr 1fr;
					column-gap: 0;
					row-gap: 1rem;
				}
			}
		}
	}

	@include respond-below(sm) {
		.hidemobile {
			display: none !important;
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
			height: calc((3rem + 0.5rem) * 11);

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
				grid-template-rows: 3rem;
				align-items: center;
				padding: 0 1rem;
				column-gap: 1rem;
				background-color: var(--color-background2);
				border-radius: var(--border-sm);
				cursor: pointer;
				transition: all 0.2s;
				color: var(--color-text2);

				&:hover {
					background-color: var(--color-background1);
				}

				@include respond-below(sm) {
					grid-template-columns: auto;
					grid-template-rows: 1fr 1fr 1fr;
					column-gap: 0;
					padding: 1rem 1rem;

					.lastseen .time {
						display: none;
					}
				}
			}

			.result.heading {
				@include respond-below(sm) {
					display: none;
				}
			}

			.heading {
				background-color: var(--color-background1);
			}
		}

		.mobile-label {
			display: none;

			@include respond-below(sm) {
				display: inline-block;
				color: var(--color-primary);
				width: 7rem;
			}
		}

		.top-switcher {
			display: none;

			@include respond-below(sm) {
				display: block;
			}
		}

		.bottom-switcher {
			@include respond-below(sm) {
				display: none;
			}
		}
	}
</style>
