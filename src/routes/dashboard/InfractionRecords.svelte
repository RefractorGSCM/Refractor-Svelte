<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"

	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import Select from "../../components/Select.svelte"
	import ServerSelector from "../../components/ServerSelector.svelte"
	import {
		getSelfInfo,
		isAdmin,
		isSuperAdmin,
		self,
	} from "../../domain/auth/store"
	import { allUsers, getAllUsers } from "../../domain/user/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	let users = writable([])
	onMount(async () => {
		if (!$self) {
			await getSelfInfo()
		}

		if ($isAdmin || $isSuperAdmin) {
			if (!$allUsers) {
				await getAllUsers()
			}

			users.set($allUsers)
		} else {
			users.set([$self])
		}
	})

	$: console.log($users)
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
					<Select name="type" label="Infraction type">
						<option value="">Any</option>
						<option value="WARNING">Warning</option>
						<option value="MUTE">Mute</option>
						<option value="KICK">Kick</option>
						<option value="Ban">Ban</option>
					</Select>

					<Select name="player" label="Player">
						<option value="player1">Player</option>
					</Select>

					<Select name="platform" label="Platform">
						<option value="">Any</option>
						<option value="playfab">Playfab</option>
					</Select>

					<Select name="user" label="User">
						<option value="">Any</option>
						{#each $users as user}
							<option value={user.id}>{user.username}</option>
						{/each}
					</Select>

					<Select name="game" label="Game">
						<option value="">Any</option>
						<option value="mordhau">Mordhau</option>
					</Select>

					<ServerSelector
						name="server_id"
						label="Server"
						defaultOption={{ id: 0, name: "Any" }}
					/>
				</div>

				<div class="button">
					<Button>Search</Button>
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
