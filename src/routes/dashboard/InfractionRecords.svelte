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

	const pageLimit = 10

	type resultStore = {
		meta: {
			total: number
			page: number
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
		},
		results: [] as InfractionSearchResult[],
	} as resultStore)

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
			},
			results: [] as InfractionSearchResult[],
		})

		// Filter out empty strings
		const updateArgs = filterZero(filterEmpty(values)) as InfractionSearchBody
		console.log("UARGS", updateArgs)

		if (Object.keys(updateArgs).length < 1) {
			errorToast("Please apply at least one filter to search")
			return
		}

		const body = {
			...updateArgs,
			limit: pageLimit,
			offset,
		} as InfractionSearchBody

		console.log("SEARCH BODY", body)

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
			current.results = results.results
			return current
		})

		currentSearch.set({
			...body,
		})
	}
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
						<option value="Ban">Ban</option>
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
						value={$store.values.platform}
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
						<option value="mordhau">Mordhau</option>
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
				grid-template-columns: 1fr 1fr 1fr;
				column-gap: 1rem;
			}
		}
	}
</style>
