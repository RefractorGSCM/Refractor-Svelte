<script lang="ts">
	import { Link, Route, Router } from "svelte-routing"
	import Heading from "../../../components/Heading.svelte"
	import { allGames } from "../../../domain/game/store"
	import Container from "../components/Container.svelte"
	import SinglePane from "../components/SinglePane.svelte"
	import Game from "./Game.svelte"

	export let url = ""
</script>

<Container style="max-height: auto; height: auto;">
	<Router {url}>
		<Route path="/:game" let:params>
			<Game name={params.game} />
		</Route>

		<Route path="/">
			<div class="title">
				<Heading type="title">Games</Heading>
			</div>

			<SinglePane>
				<div class="games-list">
					<div class="intro">Select the game you wish to configure.</div>

					<div class="list">
						{#each $allGames as game}
							<Link to={`/settings/games/${game.name}`}>
								<div class="game">
									{game.name}
								</div>
							</Link>
						{/each}
					</div>
				</div>
			</SinglePane>
		</Route>
	</Router>
</Container>

<!-- <Container>
	<div class="title">
		<Heading type="title">Game Settings</Heading>
	</div>

	<SinglePane>
		<div class="games-list">
			<div class="heading">
				<Heading>Games</Heading>
			</div>

			<div class="placeholders">
				<div>
					Available placeholders: {`{{PLAYER_ID}} {{PLAYER_NAME}} {{REASON}}`}
				</div>

				<div>All durations are in minutes.</div>
			</div>

			<div class="games">
				<Accordion bind:key={$currentlyOpen} duration={0.2}>
					{#each $allGames as game}
						<AccordionItem key={game.name}>
							<div
								slot="header"
								class="game"
								class:expanded={$currentlyOpen === game.name}
							>
								{game.name}
							</div>
							<div
								slot="body"
								class="game-content"
								class:expanded={$currentlyOpen === game.name}
							>
								{#if $loading[`gamesettings-${game.name}`]}
									<Spinner />
								{:else}
									<Heading>{game.name} Settings</Heading>

									<form class="game-form" on:submit|preventDefault={updateGame}>
										<TextInput
											name="ban-pattern"
											label="Ban Command Pattern"
											bind:value={$store.values.ban_command_pattern}
											error={$store.errors.ban_command_pattern}
											required
										/>
									</form>

									<div class="button-reset">
										<Button color="danger" on:click={resetToDefault}
											>Reset to Default</Button
										>
									</div>

									<div class="button-save">
										<Button on:click={updateGame}>Save</Button>
									</div>
								{/if}
							</div>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>
		</div>
	</SinglePane>
</Container> -->
<style lang="scss">
	.title {
		margin-bottom: 2rem;
	}

	.games-list {
		display: flex;
		flex-direction: column;

		.intro {
			margin-bottom: 2rem;
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			column-gap: 0.5rem;
			row-gap: 0.5rem;

			.game {
				background-color: var(--color-accent);
				padding: 0.5rem 1rem;
				border-radius: var(--border-sm);
				cursor: pointer;
				transition: all 0.2s;
				text-decoration: none;
				color: var(--color-text2);

				&:hover {
					background-color: var(--color-accent-light);
				}
			}
		}
	}

	// .title {
	// 	margin-bottom: 2rem;
	// }

	// .games-list {
	// 	width: 100%;

	// 	.heading {
	// 		margin-bottom: 1rem;
	// 	}

	// 	.placeholders {
	// 		margin-bottom: 2rem;
	// 	}

	// 	.games {
	// 		display: flex;
	// 		flex-direction: column;
	// 		column-gap: 1rem;
	// 		row-gap: 1rem;

	// 		.game {
	// 			width: 100%;
	// 			padding: 1rem;
	// 			background-color: var(--color-background1);
	// 			font-size: 1.6rem;
	// 			transition: background 0.2s;
	// 			cursor: pointer;
	// 			border-radius: var(--border-sm);
	// 			user-select: none;
	// 			margin-bottom: 1rem;

	// 			&:hover {
	// 				background-color: var(--color-topbar);
	// 			}

	// 			&.expanded {
	// 				margin-bottom: 0;
	// 				border-bottom-left-radius: 0;
	// 				border-bottom-right-radius: 0;
	// 			}
	// 		}

	// 		.game-content {
	// 			width: 100%;
	// 			padding: 1rem;
	// 			position: relative;
	// 			min-height: 20rem;

	// 			&.expanded {
	// 				margin-bottom: 0.5rem;
	// 				border: 2px solid var(--color-background1);
	// 			}

	// 			.game-form {
	// 				margin-top: 2rem;
	// 			}

	// 			.button-save {
	// 				position: absolute;
	// 				bottom: 1rem;
	// 				right: 1rem;
	// 			}

	// 			.button-reset {
	// 				position: absolute;
	// 				bottom: 1rem;
	// 				left: 1rem;
	// 			}
	// 		}
	// 	}
	// }
</style>
