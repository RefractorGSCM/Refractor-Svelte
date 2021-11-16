<script lang="ts">
	import { onMount } from "svelte"
	import { Accordion, AccordionItem } from "svelte-collapsible"
	import { writable } from "svelte/store"
	import Button from "../../../components/Button.svelte"
	import Heading from "../../../components/Heading.svelte"
	import ListTextInput from "../../../components/ListTextInput.svelte"
	import ConfirmModal from "../../../components/Modals/ConfirmModal.svelte"
	import NumberInput from "../../../components/NumberInput.svelte"
	import Select from "../../../components/Select.svelte"
	import Spinner from "../../../components/Spinner.svelte"
	import Toggle from "../../../components/Toggle.svelte"
	import {
		allGames,
		getAllGames,
		getGameSettings,
		setGameCommandSettings,
		setGameGeneralSettings,
	} from "../../../domain/game/store"
	import { loading, setLoading } from "../../../domain/loading/store"
	import SinglePane from "../components/SinglePane.svelte"

	export let name

	let errmsg = ""
	let game: Game = null
	let gameSettings: GameSettings = null
	let currentlyOpen = writable("")

	type _gameCommand = {
		command: string
		run_on: string
	}

	type _gameCommandSettings = {
		create: _infractionCommands
		update: _infractionCommands
		delete: _infractionCommands
		repeal: _infractionCommands
		sync: _infractionCommands
	}

	type _infractionCommands = {
		warn?: { [key: number]: _gameCommand }
		mute?: { [key: number]: _gameCommand }
		kick?: { [key: number]: _gameCommand }
		ban?: { [key: number]: _gameCommand }
	}

	const defaultErrors = {
		create: { warn: {}, mute: {}, kick: {}, ban: {} },
		update: { warn: {}, mute: {}, kick: {}, ban: {} },
		delete: { warn: {}, mute: {}, kick: {}, ban: {} },
		repeal: { warn: {}, mute: {}, kick: {}, ban: {} },
		sync: { mute: {}, ban: {} },
	}

	let commandStore = writable({
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
			sync: {
				mute: {},
				ban: {},
			},
		},
		errors: defaultErrors,
	} as {
		values: _gameCommandSettings
		errors: {
			create: _infractionCommands
			update: _infractionCommands
			delete: _infractionCommands
			repeal: _infractionCommands
			sync: {
				mute: { [key: number]: _gameCommand }
				ban: { [key: number]: _gameCommand }
			}
		}
	})

	let generalStore = writable({
		values: {},
		errors: {},
	} as {
		values: GameGeneralSettings
		errors: {
			[key: string]: any
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
		const transformedCommands = fromServerCommands(settings.commands)

		commandStore.set({
			...$commandStore,
			values: transformedCommands,
		})

		generalStore.set({
			...$generalStore,
			values: settings.general,
		})

		setLoading("game", false)
	})

	// Because we format the infraction command data differently on the client and server, we use transformation
	// functions to convert it between the two formats. toServerCommands takes client data and converts it to
	// the server command setting format.
	function toServerCommands(
		clientCommands: _gameCommandSettings,
	): GameCommandSettings {
		const transformed: GameCommandSettings = {
			create: { warn: [], mute: [], kick: [], ban: [] },
			update: { warn: [], mute: [], kick: [], ban: [] },
			delete: { warn: [], mute: [], kick: [], ban: [] },
			repeal: { warn: [], mute: [], kick: [], ban: [] },
			sync: { mute: [], ban: [] },
		}

		for (const [actKey, actVal] of Object.entries(clientCommands)) {
			for (const [infrKey, infrVal] of Object.entries(actVal)) {
				const infractions: GameCommand[] = []

				for (const cmd of Object.values(infrVal)) {
					infractions.push({
						command: cmd.command,
						run_on_all: cmd.run_on === "all",
					})
				}

				transformed[actKey][infrKey] = infractions
			}
		}

		return transformed
	}

	// Because we format the infraction command data differently on the client and server, we use transformation
	// functions to convert it between the two formats. fromServerCommands takes server data and converts it to
	// the client command setting format.
	function fromServerCommands(
		serverCommands: GameCommandSettings,
	): _gameCommandSettings {
		const transformed: _gameCommandSettings = {
			create: { warn: [], mute: [], kick: [], ban: [] },
			update: { warn: [], mute: [], kick: [], ban: [] },
			delete: { warn: [], mute: [], kick: [], ban: [] },
			repeal: { warn: [], mute: [], kick: [], ban: [] },
			sync: { mute: [], ban: [] },
		}

		for (const [actKey, actVal] of Object.entries(serverCommands)) {
			for (const [infrKey, infrVal] of Object.entries(actVal)) {
				const infractions: _gameCommand[] = []

				if (infrVal !== null) {
					for (const cmd of infrVal) {
						infractions.push({
							command: cmd.command,
							run_on: cmd.run_on_all ? "all" : "origin",
						})
					}
				}

				transformed[actKey][infrKey] = infractions
			}
		}

		return transformed
	}

	async function resetGeneralToDefault() {
		setLoading("gensettings", true)
		const defaultSettings = await getGameSettings(game.name, true)

		generalStore.set({
			...$generalStore,
			values: defaultSettings.general,
			errors: {},
		})

		setLoading("gensettings", false)
	}

	async function saveGeneralSettings() {
		setLoading("gensettings", true)

		const values = $generalStore.values

		if (typeof values.enable_ban_sync === "string") {
			values.enable_ban_sync = values.enable_ban_sync === "true"
		}

		values.player_infraction_threshold = parseInt(
			values.player_infraction_threshold.toString(),
		)
		values.player_infraction_timespan = parseInt(
			values.player_infraction_timespan.toString(),
		)

		await setGameGeneralSettings(game.name, values)

		setLoading("gensettings", false)
	}

	async function resetCommandsToDefault() {
		setLoading("cmdsettings", true)
		const defaultSettings = await getGameSettings(game.name, true)

		commandStore.set({
			...$commandStore,
			values: fromServerCommands(defaultSettings.commands),
			errors: defaultErrors,
		})

		setLoading("cmdsettings", false)
	}

	async function saveCommands() {
		setLoading("cmdsettings", true)

		const { settings, errors } = await setGameCommandSettings(
			game.name,
			toServerCommands($commandStore.values),
		)

		setLoading("cmdsettings", false)

		if (!!errors) {
			// transform errors
			const transformed = defaultErrors

			for (const [actKey, actVal] of Object.entries(errors)) {
				for (const [infrKey, infrVal] of Object.entries(actVal)) {
					transformed[actKey] = {
						...transformed[actKey],
						[infrKey]: {
							[infrVal.index]: infrVal.message,
						},
					}
				}
			}

			commandStore.set({
				...$commandStore,
				errors: transformed,
			})
		} else {
			// Update settings if no errors were returned
			commandStore.set({
				...$commandStore,
				values: fromServerCommands(settings.commands),
			})
		}
	}

	function handleGeneralToggleChange(e) {
		const checked = e.detail.target.value === "true"

		generalStore.set({
			...$generalStore,
			values: {
				...$generalStore.values,
				[e.detail.target.name]: checked,
			},
		})
	}

	function handleGeneralNumberChange(e) {
		generalStore.set({
			...$generalStore,
			values: {
				...$generalStore.values,
				[e.target.name]: e.target.value,
			},
		})
	}
</script>

{#if errmsg}
	<Heading type="subtitle">{errmsg}</Heading>
{:else if $loading["game"]}
	<Spinner blocking={false} />
{:else}
	<div class="title">
		<Heading type="title">{game?.name} Settings</Heading>
	</div>

	<SinglePane
		style="max-height: auto; position: relative; background: none; padding: 0;"
	>
		{#if $loading["gensettings"]}
			<Spinner />
		{/if}

		<div class="general">
			<div class="heading">
				<Heading type="subtitle">General Settings</Heading>
			</div>

			<div class="fields">
				<div class="field">
					<span>Enable Ban Sync</span>
					<Toggle
						name="enable_ban_sync"
						value={!!$generalStore.values?.enable_ban_sync ? "true" : "false"}
						on:change={handleGeneralToggleChange}
					/>
				</div>
				<div class="field">
					<span>Enable Mute Sync</span>
					<Toggle
						name="enable_mute_sync"
						value={!!$generalStore.values?.enable_mute_sync ? "true" : "false"}
						on:change={handleGeneralToggleChange}
					/>
				</div>
				<div class="description">
					<Heading>Player Name Display</Heading>

					<p>
						This section configures the thresholds used to display troublemaker
						players specially. As they approach the infraction threshold value
						within a the specified timespan, their name color in server lists
						will change.
					</p>
				</div>
				<div class="field">
					<NumberInput
						name="player_infraction_threshold"
						label="Infraction Thereshold"
						value={$generalStore.values?.player_infraction_threshold?.toString()}
						on:change={handleGeneralNumberChange}
					/>
				</div>
				<div class="field">
					<NumberInput
						name="player_infraction_timespan"
						label="Infraction Timespan (minutes)"
						value={$generalStore.values?.player_infraction_timespan?.toString()}
						on:change={handleGeneralNumberChange}
					/>
				</div>
			</div>

			<div class="buttons">
				<ConfirmModal
					heading="Are you sure?"
					message="This will reset all general settings to their default values. If you change your mind, reload the page without clicking save."
					submitText="Reset Settings"
					on:submit={resetGeneralToDefault}
				>
					<div slot="trigger" let:open>
						<Button color="danger" on:click={open}>Reset to Default</Button>
					</div>
				</ConfirmModal>
				<Button color="success" on:click={saveGeneralSettings}>Save</Button>
			</div>
		</div>
	</SinglePane>

	<SinglePane
		style="max-height: unset; height: auto; position: relative; overflow-y: unset;"
	>
		{#if $loading["cmdsettings"]}
			<Spinner />
		{/if}

		<div class="commands">
			<div class="heading">
				<Heading type="subtitle">Infraction Commands</Heading>

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
					on:submit={resetCommandsToDefault}
				>
					<div slot="trigger" let:open>
						<Button color="danger" on:click={open}>Reset to Default</Button>
					</div>
				</ConfirmModal>
				<Button color="success" on:click={saveCommands}>Save</Button>
			</div>

			<div class="list">
				<Accordion bind:key={$currentlyOpen} duration={0.2}>
					{#each Object.keys($commandStore.values) as action}
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
								{#each Object.keys($commandStore.values[action]) as infractionType}
									<div class="infraction-commands">
										<div class="heading">
											{infractionType} Commands
										</div>

										<div class="fields">
											{#each Object.keys($commandStore.values[action][infractionType]) as key, idx}
												<div class="field">
													<select
														name="run_on"
														bind:value={$commandStore.values[action][
															infractionType
														][key].run_on}
													>
														<option value="">Run on...</option>
														<option value="origin">Origin Server</option>
														<option value="all">All Servers</option>
													</select>

													<ListTextInput
														name={`${action}-${infractionType}-${key}`}
														bind:value={$commandStore.values[action][
															infractionType
														][key].command}
														error={$commandStore.errors[action][infractionType][
															idx
														]}
														showConfirm={false}
														on:delete={() => {
															commandStore.update((current) => {
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
													commandStore.update((current) => {
														current.values[action][infractionType][Date.now()] =
															{
																command: "",
																run_on: "",
															}
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

	.general {
		width: 100%;
		padding: 2rem;
		height: auto;
		overflow: auto;
		background-color: var(--color-background2);

		@include respond-below(md) {
			width: 100%;
		}

		.heading {
			margin-bottom: 1rem;
		}

		.fields {
			display: flex;
			flex-direction: column;

			.field {
				display: flex;
				justify-content: space-between;
				margin-bottom: 1rem;

				&:last-child {
					margin-bottom: 0;
				}
			}

			.description {
				p {
					margin-top: 0.5rem;
					margin-bottom: 1rem;
					font-size: 1.4rem;
					color: var(--color-text-muted);
				}
			}
		}

		.buttons {
			display: flex;
			justify-content: space-between;
			margin-top: 2rem;
		}
	}

	.commands {
		width: 100%;
		height: auto;

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
					display: flex;

					:global(.input-wrapper) {
						width: 100%;
					}

					:global(.input-main) {
						border-top-left-radius: 0;
						border-bottom-left-radius: 0;
					}

					select {
						background: var(--color-background1);
						border: none;
						border-top-left-radius: var(--border-sm);
						border-bottom-left-radius: var(--border-sm);
						color: var(--color-text2);
						border-right: 1px solid var(--color-topbar);
						padding-right: 1rem;
						font-size: 1.4rem;
					}
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
