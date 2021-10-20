<script lang="ts" context="module">
	import { writable } from "svelte/store"

	const pageLimit = 10

	type formStore = {
		values: {
			player?: PlayerSearchResult
			platform?: string
			server_id?: number
			game?: string
			start_date?: number
			end_date?: number
			query?: string
		}
		errors: {
			general?: any
			player_id?: any
			platform?: any
			server_id?: any
			game?: string
			start_date?: any
			end_date?: any
			query?: any
		}
	}

	type resultStore = {
		meta: {
			total: number
			page: number
			wasRun: boolean
		}
		results: ChatMessage[]
	}

	let store = writable({
		values: {
			player: undefined,
			platform: undefined,
			server_id: undefined,
			game: undefined,
			start_date: undefined,
			end_date: undefined,
			query: undefined,
		},
		errors: {},
	} as formStore)

	const currentSearch = writable({})

	const searchStore = writable({
		meta: {
			total: 0,
			page: 0,
			wasRun: false,
		},
		results: [] as ChatMessage[],
	} as resultStore)
</script>

<script lang="ts">
	import Heading from "../../components/Heading.svelte"
	import PlayerSelector from "../../components/PlayerSelector.svelte"
	import Select from "../../components/Select.svelte"
	import type { ChatMessage } from "../../domain/chat/chat.types"
	import type {
		ChatSearchBody,
		PlayerSearchResult,
	} from "../../domain/search/search.types"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
	import * as yup from "yup"
	import { reduceYupErrors } from "../../utils/yup"
	import { filterEmpty, filterZero } from "../../utils/filters"
	import { errorToast } from "../../utils/toast"
	import { searchChatMessages } from "../../domain/search/store"
	import TextInput from "../../components/TextInput.svelte"
	import { string } from "yup/lib/locale"
	import Button from "../../components/Button.svelte"
	import ServerSelector from "../../components/ServerSelector.svelte"
	import DatePicker from "../../components/DatePicker.svelte"
	import { allServers } from "../../domain/server/store"
	import type { Server } from "../../domain/server/server.types"
	import GameSelector from "../../components/GameSelector.svelte"
	import { tick, validate_each_argument } from "svelte/internal"
	import type { Game } from "../../domain/game/game.types"
	import { allGames } from "../../domain/game/store"
	import PlatformSelector from "../../components/PlatformSelector.svelte"
	import Activate from "../Activate.svelte"
	import PageSwitcher from "../../components/PageSwitcher.svelte"
	import { truncate } from "../../utils/strings"
	import { dateString } from "../../utils/date"
	import { Link, navigate } from "svelte-routing"
	import {
		checkFlag,
		FLAG_VIEW_PLAYER_RECORDS,
		getFlag,
	} from "../../permissions/permissions"
	import { self } from "../../domain/auth/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import Spinner from "../../components/Spinner.svelte"
	import sleep from "../../utils/sleep"

	function onPlayerChange(player) {
		if (!player) {
			store.set({
				...$store,
				values: {
					...$store.values,
					player: player,
				},
			})

			return
		}

		store.set({
			...$store,
			values: {
				...$store.values,
				player: player,
				platform: player.platform,
			},
		})
	}

	function onServerChange(serverID) {
		if (!serverID) {
			store.set({
				...$store,
				values: {
					...$store.values,
					server_id: serverID,
				},
			})

			return
		}

		let server: Server = null
		for (const s of $allServers) {
			if (s.id === serverID) {
				server = s
				break
			}
		}

		if (!server) {
			return
		}

		let game: Game = null
		for (const g of $allGames) {
			if (g.name === server.game) {
				game = g
				break
			}
		}

		if (!game) {
			return
		}

		store.set({
			...$store,
			values: {
				...$store.values,
				server_id: server.id,
				platform: game.platform,
				game: server.game,
			},
		})
	}

	const shouldValidate = (field) => {
		if (typeof field === "string" && field.length > 0) {
			return true
		}

		return false
	}

	const schema = yup.object().shape({
		player_id: yup.lazy((value) =>
			shouldValidate(value) ? yup.string().trim() : yup.string(),
		),
		platform: yup.lazy((value) =>
			shouldValidate(value) ? yup.string().trim() : yup.string(),
		),
		server_id: yup.lazy((value) =>
			shouldValidate(value) ? yup.number() : yup.number(),
		),
		game: yup.lazy((value) =>
			shouldValidate(value) ? yup.string() : yup.string(),
		),
		start_date: yup.lazy((value) =>
			shouldValidate(value) ? yup.number() : yup.number(),
		),
		end_date: yup.lazy((value) =>
			shouldValidate(value) ? yup.number() : yup.number(),
		),
		query: yup.lazy((value) =>
			shouldValidate(value) ? yup.string() : yup.string(),
		),
	})

	async function search() {
		const offset = $searchStore.meta.page * pageLimit

		let values = {
			player_id: $store.values.player?.id,
			platform: $store.values.platform,
			server_id: $store.values.server_id,
			game: $store.values.game,
			start_date: $store.values.start_date,
			end_date: $store.values.end_date,
			query: $store.values.query,
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
			results: [] as ChatMessage[],
		})

		// Filter out empty strings
		const searchArgs = filterZero(filterEmpty(values)) as ChatSearchBody

		if (Object.keys(searchArgs).length < 1) {
			errorToast("Please apply at least one filter to search")
			return
		}

		const body = {
			...searchArgs,
			limit: pageLimit,
			offset,
		} as ChatSearchBody

		// Run search
		setLoading("chatmessage-search", true)
		const { results, success, errors } = await searchChatMessages(body)
		await sleep(500)
		setLoading("chatmessage-search", false)

		if (!success) {
			if (errors) {
				store.set({
					...$store,
					errors: {
						...$store.errors,
						...errors,
					},
				})
				return
			}

			errorToast("Could not run search")
			return
		}

		searchStore.update((current) => {
			current.meta.total = results.total
			current.meta.wasRun = true
			current.results = results.results
			return current
		})

		currentSearch.set({
			...body,
		})
	}

	async function nextPage() {
		if ($searchStore.meta.page >= $amountOfPages - 1) {
			return
		}

		const nextPage = $searchStore.meta.page + 1

		const body = {
			...$currentSearch,
			limit: pageLimit,
			offset: nextPage * pageLimit,
		} as ChatSearchBody

		// Run search
		const { results, success, errors } = await searchChatMessages(body)

		if (!success) {
			if (errors) {
				store.set({
					...$store,
					errors: {
						...$store.errors,
						...errors,
					},
				})
				return
			}

			errorToast("Could not run search")
			return
		}

		searchStore.update((current) => {
			current.meta.total = results.total
			current.meta.page = nextPage
			current.results = results.results
			return current
		})
	}

	async function prevPage() {
		if ($searchStore.meta.page <= 0) {
			return
		}

		const prevPage = $searchStore.meta.page - 1

		const body = {
			...$currentSearch,
			limit: pageLimit,
			offset: prevPage * pageLimit,
		} as ChatSearchBody

		// Run search
		const { results, success, errors } = await searchChatMessages(body)

		if (!success) {
			if (errors) {
				store.set({
					...$store,
					errors: {
						...$store.errors,
						...errors,
					},
				})
				return
			}

			errorToast("Could not run search")
			return
		}

		searchStore.update((current) => {
			current.meta.total = results.total
			current.meta.page = prevPage
			current.results = results.results
			return current
		})
	}

	let amountOfPages = writable(0)
	$: amountOfPages.set(Math.ceil($searchStore.meta.total / pageLimit))

	async function onTimeClick(date: Date) {
		date = new Date(date)

		const startDate = Math.round(date.getTime() / 1000 - 2 * 60) // 2 minutes in the past from the provided date
		const endDate = Math.round(date.getTime() / 1000 + 2 * 60) // 2 minutes into the future from the provided date

		console.log(startDate, endDate)

		store.set({
			...$store,
			values: {
				...$store.values,
				start_date: startDate,
				end_date: endDate,
			},
		})
	}
</script>

<Container>
	<div class="title">
		<Heading type="title">Chat Records</Heading>
	</div>

	<SinglePane>
		<div class="search-form">
			<div class="heading">
				<Heading>Search Infractions</Heading>
			</div>

			<form class="form" on:submit|preventDefault={search}>
				<div class="main">
					<div class="span-2">
						<TextInput
							name="query"
							label="Search query"
							bind:value={$store.values.query}
							error={$store.errors.query}
							required
						/>
					</div>

					<DatePicker
						name="start_date"
						label="Start date"
						value={!!$store.values.start_date
							? new Date($store.values.start_date * 1000)
							: null}
						error={$store.errors.start_date}
						on:select={({ detail }) => {
							store.set({
								...$store,
								values: {
									...$store.values,
									start_date: !!detail
										? Math.round(detail.getTime() / 1000)
										: undefined,
								},
							})
						}}
					/>

					<DatePicker
						name="end_date"
						label="End date"
						value={!!$store.values.end_date
							? new Date($store.values.end_date * 1000)
							: null}
						error={$store.errors.end_date}
						on:select={({ detail }) => {
							store.set({
								...$store,
								values: {
									...$store.values,
									end_date: !!detail
										? Math.round(detail.getTime() / 1000)
										: undefined,
								},
							})
						}}
					/>

					<PlayerSelector
						name="player"
						label="Player"
						selectText="Any"
						disabled={!checkFlag(
							$self.permissions,
							getFlag(FLAG_VIEW_PLAYER_RECORDS),
						)}
						on:change={({ detail }) => onPlayerChange(detail)}
						bind:value={$store.values.player}
						error={$store.errors.player_id}
					/>

					<PlatformSelector
						name="platform"
						label="Platform"
						defaultOption="Any"
						defaultOptionValue={""}
						bind:value={$store.values.platform}
						error={$store.errors.platform}
						disabled={!!$store.values.player || !!$store.values.server_id}
					/>

					<ServerSelector
						name="server_id"
						label="Server"
						defaultOption={{ id: 0, name: "Any" }}
						value={$store.values.server_id}
						error={$store.errors.server_id}
						platform={!!$store.values.platform ? $store.values.platform : null}
						on:change={({ detail }) => onServerChange(detail)}
					/>

					<GameSelector
						name="game"
						label="Game"
						defaultOption="Any"
						defaultOptionValue=""
						bind:value={$store.values.game}
						error={$store.errors.game}
						disabled={!!$store.values.server_id}
					/>
				</div>

				<div class="button">
					<Button on:click={search}>Search</Button>
				</div>
			</form>
		</div>
	</SinglePane>

	<div class="results">
		{#if $searchStore.results?.length > 0}
			<div class="heading">
				<Heading>Found {$searchStore.meta.total} Results</Heading>
			</div>

			<PageSwitcher
				on:prev:click={prevPage}
				on:next:click={nextPage}
				prevDisabled={$searchStore.meta.page <= 0}
				nextDisabled={$searchStore.meta.page >= $amountOfPages - 1}
				page={$searchStore.meta.page + 1}
			/>

			<div class="list">
				<div class="result heading">
					<div class="id">ID</div>
					<div class="date">Date</div>
					<div class="name">Name</div>
					<div class="message">Message</div>
				</div>

				{#each $searchStore.results as result}
					<div class="result">
						<div class="id">
							<span class="mobile-label">ID: </span>{result.id}
						</div>

						<div
							class="date-recorded"
							on:click={() => onTimeClick(result.created_at)}
						>
							<span class="mobile-label">Date: </span><span class="date">
								{dateString(new Date(result.created_at)).split(",")[0]}
							</span>
							<span class="time">
								{dateString(new Date(result.created_at)).split(",")[1]}
							</span>
						</div>

						<a
							href={`/player/${result.platform}/${result.player_id}`}
							on:click|preventDefault={() =>
								navigate(`/player/${result.platform}/${result.player_id}`)}
							class="name"
						>
							<span class="mobile-label">Name: </span>{result.name}
						</a>

						<div class="message">
							<span class="mobile-label">Message: </span>{truncate(
								result.message,
								150,
							)}
						</div>
					</div>
				{/each}
			</div>

			<PageSwitcher
				on:prev:click={prevPage}
				on:next:click={nextPage}
				prevDisabled={$searchStore.meta.page <= 0}
				nextDisabled={$searchStore.meta.page >= $amountOfPages - 1}
				page={$searchStore.meta.page + 1}
			/>
		{:else if $loading["chatmessage-search"]}
			<Spinner noBackground />
		{:else if $searchStore.meta.wasRun && (!$searchStore.results || $searchStore.results.length < 1)}
			<Heading>No results found</Heading>
		{/if}
	</div>
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
				grid-template-columns: 1fr 1fr 1fr 1fr;
				column-gap: 1rem;

				.span-2 {
					grid-column: span 2;
				}
			}

			@include respond-below(md) {
				.main {
					grid-template-columns: 1fr 1fr;
				}
			}

			@include respond-below(xs) {
				padding-bottom: 2rem;

				.main {
					grid-template-columns: 1fr;
				}

				.span-2 {
					grid-column: unset !important;
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
		position: relative;
		min-height: 30vh;

		.list {
			margin-top: 1rem;
			width: 100%;
			display: flex;
			flex-direction: column;
			min-height: calc((2.5rem) * 11);

			&:last-child {
				margin-bottom: 0;
			}

			.result {
				width: 100%;
				min-height: 2.5rem;
				display: grid;
				grid-template-columns: 1fr 3fr 1.5fr 8fr;
				align-items: center;
				padding: 0.3rem 1rem;
				column-gap: 1rem;
				transition: all 0.2s;
				color: var(--color-text2);

				&:nth-child(odd) {
					background-color: var(--color-background2);
				}

				&:nth-child(even) {
					background-color: var(--color-background3);
				}

				.message {
					min-height: 2.5rem;
					height: 100%;
				}

				@include respond-below(sm) {
					grid-template-columns: 1fr;
					grid-template-rows: 1fr 1fr 1fr auto;
				}

				.name {
					transition: all 0.1s;
					cursor: pointer;
					color: var(--color-text2);

					&:hover {
						color: var(--color-primary-light);
					}
				}

				.date-recorded {
					transition: all 0.1s;
					cursor: pointer;
					color: var(--color-text2);

					&:hover {
						color: var(--color-primary-light);
					}
				}
			}

			.result.heading {
				border-radius: var(--border-sm);
				font-weight: bold;
				background-color: var(--color-background1) !important;
				height: 3rem;
				margin-bottom: 0.5rem;

				@include respond-below(sm) {
					display: none;
				}

				.message {
					min-height: unset;
					height: auto;
				}
			}
		}

		.mobile-label {
			display: none;

			@include respond-below(sm) {
				display: inline-block;
				color: var(--color-primary);
				width: 7.5rem;
			}
		}
	}
</style>
