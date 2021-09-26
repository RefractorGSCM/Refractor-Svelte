<script lang="ts" context="module">
	type formStore = {
		values: {
			type?: string
			player?: PlayerSearchResult
			platform?: string
			user_id?: string
			game?: string
			server_id?: number
		}
		errors: {
			general?: any
			type?: any
			player_id?: any
			platform?: any
			user_id?: any
			game?: any
			server_id?: any
		}
	}

	type resultStore = {
		meta: {
			total: number
			page: number
			wasRun: boolean
		}
		results: InfractionSearchResult[]
	}

	let store = writable({
		values: {
			type: undefined,
			player: undefined,
			platform: undefined,
			user_id: undefined,
			game: undefined,
			server_id: undefined,
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
		results: [] as InfractionSearchResult[],
	} as resultStore)
</script>

<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"

	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import PlayerSelector from "../../components/PlayerSelector.svelte"
	import Select from "../../components/Select.svelte"
	import ServerSelector from "../../components/ServerSelector.svelte"
	import {
		getSelfInfo,
		isAdmin,
		isSuperAdmin,
		self,
	} from "../../domain/auth/store"
	import type {
		InfractionSearchBody,
		InfractionSearchResult,
		PlayerSearchResult,
	} from "../../domain/search/search.types"
	import { allUsers, getAllUsers } from "../../domain/user/store"
	import { reduceYupErrors } from "../../utils/yup"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
	import * as yup from "yup"
	import {
		filterEmpty,
		filterEmptyStrings,
		filterUndefined,
		filterZero,
	} from "../../utils/filters"
	import { errorToast } from "../../utils/toast"
	import { searchInfractions } from "../../domain/search/store"
	import { navigate } from "svelte-routing"
	import { dateString } from "../../utils/date"
	import { truncate } from "../../utils/strings"
	import PageSwitcher from "../../components/PageSwitcher.svelte"

	const pageLimit = 10

	let users = writable([])
	onMount(async () => {
		if (!$self) {
			await getSelfInfo()
		}

		if ($isAdmin || $isSuperAdmin) {
			await getAllUsers()

			users.set($allUsers)
		} else {
			users.set([$self])
		}
	})

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

	const shouldValidate = (field) => {
		if (typeof field === "string" && field.length > 0) {
			return true
		}

		return false
	}

	const schema = yup.object().shape({
		type: yup.lazy((value) =>
			shouldValidate(value)
				? yup.string().trim().oneOf(["WARNING", "MUTE", "KICK", "BAN"])
				: yup.string(),
		),
		player_id: yup.lazy((value) =>
			shouldValidate(value) ? yup.string().trim() : yup.string(),
		),
		platform: yup.lazy((value) =>
			shouldValidate(value) ? yup.string().trim() : yup.string(),
		),
		user_id: yup.lazy((value) =>
			shouldValidate(value) ? yup.string().trim() : yup.string(),
		),
		game: yup.lazy((value) =>
			shouldValidate(value) ? yup.string().trim() : yup.string(),
		),
		server_id: yup.lazy((value) =>
			shouldValidate(value) ? yup.number() : yup.number(),
		),
	})

	async function search() {
		const offset = $searchStore.meta.page * pageLimit

		let values = {
			type: $store.values.type,
			player_id: $store.values.player?.id,
			platform: $store.values.platform,
			user_id: $store.values.user_id,
			game: $store.values.game,
			server_id: $store.values.server_id,
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
			results: [] as InfractionSearchResult[],
		})

		// Filter out empty strings
		const updateArgs = filterZero(filterEmpty(values)) as InfractionSearchBody

		if (Object.keys(updateArgs).length < 1) {
			errorToast("Please apply at least one filter to search")
			return
		}

		const body = {
			...updateArgs,
			limit: pageLimit,
			offset,
		} as InfractionSearchBody

		// Run search
		const { results, success, errors } = await searchInfractions(body)

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
		} as InfractionSearchBody

		// Run search
		const { results, success, errors } = await searchInfractions(body)

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
		} as InfractionSearchBody

		// Run search
		const { results, success, errors } = await searchInfractions(body)

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
</script>

<Container>
	<div class="title">
		<Heading type="title">Infraction Records</Heading>
	</div>

	<SinglePane>
		<div class="search-form">
			<div class="heading">
				<Heading>Search Infractions</Heading>
			</div>

			<form class="form" on:submit|preventDefault>
				<div class="main">
					<Select
						name="type"
						label="Infraction type"
						bind:value={$store.values.type}
						error={$store.errors.type}
					>
						<option value="">Any</option>
						<option value="WARNING">Warning</option>
						<option value="MUTE">Mute</option>
						<option value="KICK">Kick</option>
						<option value="BAN">Ban</option>
					</Select>

					<PlayerSelector
						name="player"
						label="Player"
						selectText="Any"
						on:change={({ detail }) => onPlayerChange(detail)}
						bind:value={$store.values.player}
						error={$store.errors.player_id}
					/>

					<Select
						name="platform"
						label="Platform"
						bind:value={$store.values.platform}
						error={$store.errors.platform}
						disabled={!!$store.values.player}
					>
						<option value="">Any</option>
						<option value="playfab">Playfab</option>
					</Select>

					<Select
						name="user"
						label="User"
						bind:value={$store.values.user_id}
						error={$store.errors.user_id}
					>
						<option value="">Any</option>
						{#each $users as user}
							<option value={user.id}>{user.username}</option>
						{/each}
					</Select>

					<Select
						name="game"
						label="Game"
						bind:value={$store.values.game}
						error={$store.errors.game}
					>
						<option value="">Any</option>
						<option value="Mordhau">Mordhau</option>
					</Select>

					<ServerSelector
						name="server_id"
						label="Server"
						defaultOption={{ id: 0, name: "Any" }}
						value={$store.values.server_id}
						error={$store.errors.server_id}
						on:change={({ detail }) =>
							store.set({
								...$store,
								values: {
									...$store.values,
									server_id: detail,
								},
							})}
					/>
				</div>

				<div class="button">
					<Button on:click={search}>Search</Button>
				</div>
			</form>
		</div>
	</SinglePane>

	{#if $searchStore.results && $searchStore.results.length > 0}
		<div class="results">
			<div class="heading">
				<Heading>Showing {$searchStore.meta.total} Results</Heading>
			</div>

			<PageSwitcher
				on:prev:click={prevPage}
				on:next:click={nextPage}
				prevDisabled={$searchStore.meta.page <= 0}
				nextDisabled={$searchStore.meta.page >= $amountOfPages - 1}
				page={$searchStore.meta.page + 1}
			/>

			<div class="list">
				<div class="result heading hidemobile">
					<div class="type">Type</div>
					<div class="player">Player</div>
					<div class="issuer">Issuer</div>
					<div class="date">Date</div>
					<div class="duration">Duration</div>
				</div>
				{#each $searchStore.results as result}
					<a
						class="result"
						class:has-duration={["MUTE", "BAN"].includes(result.type)}
						href={`/infraction/${result.id}`}
						on:click|preventDefault={() => navigate(`/infraction/${result.id}`)}
					>
						<div class="type">
							<span class="mobile-label">Type: </span>{result.type}
						</div>
						<div class="player">
							<span class="mobile-label"
								>Player:
							</span>{result.platform}/{result.player_name}
						</div>
						<div class="issuer">
							<span class="mobile-label">Issuer: </span>{result.issuer_name}
						</div>
						<div class="date">
							<span class="mobile-label">Date: </span><span class="date">
								{dateString(new Date(result.created_at)).split(",")[0]}
							</span>
							<span class="time">
								{dateString(new Date(result.created_at)).split(",")[1]}
							</span>
						</div>
						<div class="duration">
							<span class="mobile-label">Length: </span>{result.duration
								? `${result.duration} mins`
								: ""}
						</div>
						<div class="reason">
							<span class="mobile-label">Reason: </span>{truncate(
								result.reason,
								100,
							)}
						</div>
					</a>
				{/each}
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
				grid-template-columns: 1fr 1fr 1fr;
				column-gap: 1rem;
			}
		}

		@include respond-below(sm) {
			.form {
				.main {
					grid-template-columns: 1fr;
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

				@include respond-below(sm) {
					margin-bottom: 1rem;
				}
			}

			&:last-child {
				margin-bottom: 0;
			}

			.result {
				width: 100%;
				display: grid;
				height: 5rem;
				grid-template-columns: 1fr 1fr 1fr 2fr 0.5fr;
				grid-template-rows: 2.5rem 2.5rem;
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

				.reason {
					grid-column: span 4;
				}

				@include respond-below(sm) {
					padding: 1rem 1rem;
					grid-template-columns: 1fr;
					grid-template-rows: 1fr 1fr 1fr 1fr auto;

					.reason {
						grid-column: auto;
					}

					.duration .mobile-label {
						display: none;
					}

					.date {
						.time {
							display: none;
						}
					}
				}
			}

			.result.has-duration {
				@include respond-below(sm) {
					grid-template-rows: 1fr 1fr 1fr 1fr 1fr auto;

					.duration .mobile-label {
						display: inline;
					}
				}
			}

			.heading {
				background-color: var(--color-background1);
				grid-template-rows: 3rem;
			}

			.mobile-label {
				display: none;

				@include respond-below(sm) {
					display: inline-block;
					color: var(--color-primary);
					width: 6.5rem;
				}
			}
		}
	}
</style>
