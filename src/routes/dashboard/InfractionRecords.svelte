<script lang="ts">
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import Select from "../../components/Select.svelte"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
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
						<option value="WARNING">Warning</option>
						<option value="MUTE">Mute</option>
						<option value="KICK">Kick</option>
						<option value="Ban">Ban</option>
					</Select>

					<Select name="player" label="Player">
						<option value="player1">Player</option>
					</Select>

					<Select name="platform" label="Platform">
						<option value="playfab">Playfab</option>
					</Select>

					<Select name="user" label="User">
						<option value="user1">User1</option>
					</Select>

					<Select name="game" label="Game">
						<option value="mordhau">Mordhau</option>
					</Select>

					<Select name="server" label="Server">
						<option value="1">Server 1</option>
						<option value="2">Server 2</option>
					</Select>
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
				grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
				column-gap: 1rem;
			}
		}
	}
</style>
