<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"

	import { writable } from "svelte/store"
	import type {
		PlayerSearchBody,
		PlayerSearchResult,
	} from "../../domain/search/search.types"
	import Button from "../Button.svelte"
	import Select from "../Select.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"
	import * as yup from "yup"
	import { searchPlayers } from "../../domain/search/store"
	import { reduceYupErrors } from "../../utils/yup"
	import { navigate } from "svelte-routing"
	import Heading from "../Heading.svelte"

	let selectedPlayer = writable(null as PlayerSearchResult)

	const pageLimit = 6

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

	function cleanup() {
		store.set({
			values: {
				term: "",
				type: "name",
				platform: "",
			},
			errors: {},
		})

		searchStore.set({
			meta: {
				total: 0,
				page: 0,
			},
			results: [] as PlayerSearchResult[],
		})

		currentSearch.set({
			term: "",
			type: "",
			platform: "",
		})

		selectedPlayer.set(null)
	}

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

	const dispatch = createEventDispatcher()

	function submit(e, close) {
		if (!$selectedPlayer) {
			return
		}

		dispatch("submit", $selectedPlayer)

		close()
	}
</script>

<Modal on:close={cleanup} fullWidth fullHeight>
	<div slot="trigger" let:open>
		<slot name="trigger" openPlayerSelector={open} {open} />
	</div>
	<div slot="header">
		<div class="header">Select a Player</div>
	</div>
	<div slot="content">
		<div class="content">
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

					<div class="button">
						<Button on:click={search}>Search</Button>
					</div>
				</div>
			</form>

			{#if $searchStore.results.length > 0}
				<div class="results">
					<div class="heading">
						<Heading>Showing {$searchStore.meta.total} Results</Heading>
					</div>

					<div class="list">
						<div class="result heading">
							<div class="name">Name</div>
							<div class="lastseen nomobile">Last Seen</div>
							<div class="platform nomobile">Platform</div>
						</div>
						{#each $searchStore.results as result}
							<div
								class="result"
								class:selected={$selectedPlayer &&
									$selectedPlayer.id === result.id}
								on:click|preventDefault={() => selectedPlayer.set(result)}
							>
								<div class="name">{result.name}</div>
								<div class="lastseen nomobile">
									{dateString(new Date(result.last_seen))}
								</div>
								<div class="platform nomobile">{result.platform}</div>
							</div>
						{/each}
					</div>

					<div class="page-switcher">
						<div
							class="prev"
							class:disabled={$searchStore.meta.page <= 0}
							on:click={prevPage}
						>
							Prev
						</div>
						<div class="page">{$searchStore.meta.page + 1}</div>
						<div
							class="next"
							class:disabled={$searchStore.meta.page >= $amountOfPages - 1}
							on:click={nextPage}
						>
							Next
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={(e) => submit(e, close)} disabled={!!!$selectedPlayer}
			>Select Player</Button
		>
	</div>
</Modal>

<style lang="scss">
	@import "../../mixins/mixins";

	.buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1rem;
		padding: 0 2rem;
		padding-bottom: 2rem;
		place-items: center;

		:global(.btn) {
			width: 100%;
		}
	}

	.header {
		padding: 1.2rem 2rem;
		font-size: 2rem;
		border-bottom: 1px solid var(--color-primary);
	}

	.content {
		font-size: 1.4rem;
		padding: 0 2rem;
		padding-top: 2rem;
		min-width: 40rem;
		max-width: 100%;
		height: 100%;

		.form {
			width: 100%;
			display: grid;

			.main {
				width: 100%;
				display: grid;
				grid-template-columns: 5fr 1fr 1fr 1fr;
				column-gap: 1rem;

				.button {
					:global(.btn) {
						width: 100%;
					}
				}
			}
		}

		.results {
			width: 100%;
			height: 100%;
			font-size: 1.6rem;

			.list {
				margin-top: 1rem;
				width: 100%;
				min-height: 28rem;
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
						background-color: var(--color-primary);
					}
				}

				.result.selected {
					background-color: var(--color-primary);
				}

				.heading {
					background-color: var(--color-primary);
				}
			}

			.page-switcher {
				width: 100%;
				height: 2rem;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 1.6rem;
				user-select: none;

				.next,
				.prev {
					padding: 0 1rem;
					color: var(--color-primary-light);
					cursor: pointer;
				}

				.next.disabled,
				.prev.disabled {
					color: var(--color-text-muted);
					cursor: unset;
				}
			}
		}

		.nomobile {
			display: none;
		}

		@include respond-below(sm) {
			min-width: 100%;
			width: 100%;

			.form {
				.main {
					grid-template-columns: 1fr;
				}
			}

			.results {
				margin-top: 1rem;
			}
		}
	}
</style>
