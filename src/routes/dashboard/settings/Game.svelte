<script lang="ts">
	import { onMount } from "svelte"
	import { Accordion, AccordionItem } from "svelte-collapsible"
	import { writable } from "svelte/store"
	import Button from "../../../components/Button.svelte"
	import Heading from "../../../components/Heading.svelte"
	import ListTextInput from "../../../components/ListTextInput.svelte"
	import ConfirmModal from "../../../components/Modals/ConfirmModal.svelte"
	import Spinner from "../../../components/Spinner.svelte"
	import {
		allGames,
		getAllGames,
		getGameSettings,
		setGameCommandSettings,
	} from "../../../domain/game/store"
	import { loading, setLoading } from "../../../domain/loading/store"
	import SinglePane from "../components/SinglePane.svelte"

	export let name

	let errmsg = ""
	let game: Game = null
	let gameSettings: GameSettings = null
	let currentlyOpen = writable("")

	type infractionCommands = {
		warn: { [key: number]: string }
		mute: { [key: number]: string }
		kick: { [key: number]: string }
		ban: { [key: number]: string }
	}

	const defaultErrors = {
		create: { warn: {}, mute: {}, kick: {}, ban: {} },
		update: { warn: {}, mute: {}, kick: {}, ban: {} },
		delete: { warn: {}, mute: {}, kick: {}, ban: {} },
		repeal: { warn: {}, mute: {}, kick: {}, ban: {} },
	}

	let store = writable({
		values: {
			create: {
				warn: {},
				mute: {},
				kick: {},
				ban: {},
			},
			update: {
				warn: {},
				mute: {},
				kick: {},
				ban: {},
			},
			delete: {
				warn: {},
				mute: {},
				kick: {},
				ban: {},
			},
			repeal: {
				warn: {},
				mute: {},
				kick: {},
				ban: {},
			},
		},
		errors: defaultErrors,
	} as {
		values: {
			create: infractionCommands
			update: infractionCommands
			delete: infractionCommands
			repeal: infractionCommands
		}
		errors: {
			create: infractionCommands
			update: infractionCommands
			delete: infractionCommands
			repeal: infractionCommands
		}
	})

	onMount(async () => {
		setLoading("game", true)

		if ($allGames.length === 0) {
			await getAllGames()
		}

		let gameExists = false
		for (const g of $allGames) {
			if (g.name === name) {
				game = g
				gameExists = true
				break
			}
		}

		if (!gameExists) {
			errmsg = "Game not found"
			setLoading("game", false)
			return
		}

		const settings = await getGameSettings(game.name, false)
		console.log("settings", settings)
		store.set({
			...$store,
			values: settings.commands,
		})

		setLoading("game", false)
	})

	async function resetToDefault() {
		setLoading("cmdsettings", true)
		const defaultSettings = await getGameSettings(game.name, true)

		store.set({
			...$store,
			values: defaultSettings.commands,
			errors: defaultErrors,
		})

		setLoading("cmdsettings", false)
	}

	async function saveCommands() {
		setLoading("cmdsettings", true)

		// Transform flat command structure to arrays
		const transformed: GameCommandSettings = {
			create: { warn: [], mute: [], kick: [], ban: [] },
			update: { warn: [], mute: [], kick: [], ban: [] },
			delete: { warn: [], mute: [], kick: [], ban: [] },
			repeal: { warn: [], mute: [], kick: [], ban: [] },
		}

		for (const [action, actVal] of Object.entries($store.values)) {
			for (const infrType of Object.keys(actVal)) {
				transformed[action][infrType] = Object.values(actVal[infrType])
			}
		}

		await setGameCommandSettings(game.name, transformed)

		setLoading("cmdsettings", false)
	}

	$: console.log("Store", $store)
</script>

{#if errmsg}
	<Heading type="subtitle">{errmsg}</Heading>
{:else if $loading["game"]}
	<Spinner blocking={false} />
{:else}
	<div class="title">
		<Heading type="title">{game?.name} Settings</Heading>
	</div>

	<SinglePane style="max-height: auto; position: relative;">
		{#if $loading["cmdsettings"]}
			<Spinner />
		{/if}

		<div class="commands">
			<div class="heading">
				<Heading>Infraction Commands</Heading>

				<p>
					Each action below contains commands specific to individual infraction
					types. When any of the actions are run, the commands of the correct
					infraction type will also be run.
				</p>
			</div>

			<div class="placeholders">
				<p>
					Available placeholders: {`{{PLAYER_ID}} {{PLAYER_NAME}} {{PLATFORM}} {{DURATION}} {{REASON}}`}
				</p>

				<p>All durations are in minutes.</p>
			</div>

			<div class="buttons">
				<ConfirmModal
					heading="Are you sure?"
					message="This will reset all commands to their default values. If you change your mind, reload the page without clicking save."
					submitText="Reset Commands"
					on:submit={resetToDefault}
				>
					<div slot="trigger" let:open>
						<Button color="danger" on:click={open}>Reset to Default</Button>
					</div>
				</ConfirmModal>
				<Button color="success" on:click={saveCommands}>Save</Button>
			</div>

			<div class="list">
				<Accordion bind:key={$currentlyOpen} duration={0.2}>
					{#each Object.keys($store.values) as action}
						<AccordionItem key={action}>
							<div
								slot="header"
								class="command"
								class:expanded={$currentlyOpen === action}
							>
								Infraction {action}
							</div>

							<div
								slot="body"
								class="command-content"
								class:expanded={$currentlyOpen === action}
							>
								{#each Object.keys($store.values[action]) as infractionType}
									<div class="infraction-commands">
										<div class="heading">
											{infractionType} Commands
										</div>

										<div class="fields">
											{#each Object.keys($store.values[action][infractionType]) as key}
												<div class="field">
													<ListTextInput
														name={`${action}-${infractionType}-${key}`}
														bind:value={$store.values[action][infractionType][
															key
														]}
														error={$store.errors[action][infractionType][key]}
														showConfirm={false}
														on:delete={() => {
															store.update((current) => {
																delete current.values[action][infractionType][
																	key
																]

																return current
															})
														}}
													/>
												</div>
											{/each}
										</div>

										<div class="button-add">
											<Button
												size="inline"
												on:click={() => {
													store.update((current) => {
														current.values[action][infractionType][Date.now()] =
															""
														return current
													})
												}}>+</Button
											>
										</div>
									</div>
								{/each}
							</div>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>
		</div>
	</SinglePane>
{/if}

<style lang="scss">
	@import "../../../mixins/mixins";

	.title {
		margin-bottom: 2rem;
	}

	.commands {
		width: 100%;
		height: auto;
		overflow: auto;

		.heading {
			margin-bottom: 1rem;

			p {
				margin-top: 1rem;
				font-size: 1.6rem;
			}
		}

		.placeholders {
			padding-bottom: 1rem;
			margin-bottom: 1rem;
			font-size: 1.6rem;
			border-bottom: 1px solid var(--color-accent);
		}

		.list {
			display: flex;
			flex-direction: column;
			column-gap: 1rem;
			row-gap: 1rem;

			.command {
				width: 100%;
				padding: 1rem;
				background-color: var(--color-background1);
				font-size: 1.8rem;
				transition: background 0.2s;
				cursor: pointer;
				border-radius: var(--border-sm);
				user-select: none;
				margin-bottom: 1rem;
				text-transform: capitalize;

				&:hover {
					background-color: var(--color-topbar);
				}

				&.expanded {
					margin-bottom: 0;
					border-bottom-left-radius: 0;
					border-bottom-right-radius: 0;
				}
			}

			.command-content {
				width: 100%;
				padding: 1rem;
				position: relative;

				&.expanded {
					margin-bottom: 0.5rem;
					border: 2px solid var(--color-background1);
				}

				display: grid;
				grid-template-columns: 1fr 1fr;
				row-gap: 1rem;
				column-gap: 1rem;

				@include respond-below(xl) {
					grid-template-columns: 1fr;
				}
			}

			.infraction-commands {
				.heading {
					text-transform: capitalize;
					font-size: 1.8rem;
					font-weight: 500;
					margin-top: 1rem;
					margin-bottom: 1rem;
				}

				.fields {
					display: flex;
					flex-direction: column;
				}

				.field {
					margin-bottom: 1rem;
				}

				.button-add {
					:global(.btn) {
						width: 2.5rem;
						height: 2.5rem;
						font-size: 2rem;
					}
				}
			}
		}

		.buttons {
			display: flex;
			justify-content: space-between;
			margin-bottom: 1rem;
		}
	}
</style>
