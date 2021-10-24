<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import type { UpdateServerParams } from "../../domain/server/server.types"
	import { updateServer } from "../../domain/server/store"
	import { filterEmptyStrings } from "../../utils/filters"
	import { reduceYupErrors } from "../../utils/yup"

	import Button from "../Button.svelte"
	import GameSelector from "../GameSelector.svelte"
	import NumberInput from "../NumberInput.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"

	export let initialValues: UpdateServerParams = {}
	export let serverId: number

	type fields = {
		values: {
			game?: string
			name?: string
			address?: string
			rcon_port?: string
			rcon_password?: string
		}
		errors: {
			game?: string
			name?: string
			address?: string
			rcon_port?: string
			rcon_password?: string
		}
	}

	const store = writable({
		values: {
			game: "",
			name: "",
			address: "",
			rcon_port: "",
			rcon_password: "",
		},
		errors: {},
	} as fields)

	onMount(() => {
		if (Object.keys(initialValues).length < 1) {
			return
		}

		store.set({
			...$store,
			values: {
				...$store.values,
				...initialValues,
			},
		})
	})

	function cleanup() {
		// Reset to initial values
		store.set({
			...$store,
			values: {
				...initialValues,
			},
			errors: {},
		})
	}

	function onChange({ target }) {
		store.set({
			...$store,
			values: {
				...$store.values,
				[target.name]: target.value,
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
		game: yup.lazy((value) =>
			shouldValidate(value)
				? yup
						.string()
						.trim()
						.required("Game is required")
						.min(1, "Must be no less than 1 character in length")
						.max(32, "Must be no more than 32 characters in length")
				: yup.string(),
		),
		name: yup.lazy((value) =>
			shouldValidate(value)
				? yup
						.string()
						.trim()
						.min(1, "Must be no less than 1 character in length")
						.max(20, "Must be nore more than 20 characters in length")
				: yup.string(),
		),
		address: yup.lazy((value) =>
			shouldValidate(value)
				? yup
						.string()
						// @ts-ignore
						.ipv4()
				: yup.string(),
		),
		rcon_port: yup.lazy((value) =>
			shouldValidate(value)
				? yup
						.string()
						.notRequired()
						.test("min", "Port number can't be less than 1", (val) => {
							if (!val) {
								return true
							}

							const num = parseInt(val)

							if (num > 0) {
								return true
							}

							return false
						})
						.test("max", "Port number can't be greater than 65535", (val) => {
							if (!val) {
								return true
							}

							const num = parseInt(val)

							if (num <= 65535) {
								return true
							}

							return false
						})
				: yup.string(),
		),
		rcon_password: yup.lazy((value) =>
			shouldValidate(value)
				? yup
						.string()
						.notRequired()
						.trim()
						.min(1, "Must be no less than 1 character in length")
						.max(128, "Must be no more than 128 characters in length")
				: yup.string(),
		),
	})

	async function submit(e, close) {
		e.preventDefault()

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

		// Filter out empty strings
		const updateArgs = filterEmptyStrings(values) as UpdateServerParams

		// Update server and report any errors back
		const errors = await updateServer(serverId, updateArgs)
		store.set({
			...$store,
			errors,
		})

		console.log("Editing server")
		close()

		// If no errors were returned, the server update succeeded. Close the form.
		if (!errors) {
			close()
		}
	}
</script>

<Modal on:close={cleanup}>
	<div slot="trigger" let:open>
		<slot name="trigger" {open} />
	</div>
	<div slot="header">
		<div class="header">Editing Server</div>
	</div>
	<div slot="content">
		<div class="content">
			<p>
				Update the fields you want to change and then click "Save Changes". If
				you don't want to update a field, then don't modify it's value.
			</p>

			<form class="form" on:submit|preventDefault={() => {}}>
				<GameSelector
					name="game"
					label="Game"
					bind:value={$store.values.game}
					error={$store.errors.game}
				/>

				<TextInput
					name="name"
					autocomplete="off"
					label="Name"
					value={$store.values.name}
					error={$store.errors.name}
					on:input={onChange}
				/>

				<TextInput
					name="address"
					autocomplete="off"
					label="RCON Address"
					value={$store.values.address}
					error={$store.errors.address}
					on:input={onChange}
				/>

				<NumberInput
					name="rcon_port"
					label="RCON port"
					value={$store.values.rcon_port}
					error={$store.errors.rcon_port}
					on:input={onChange}
				/>

				<TextInput
					name="rcon_password"
					autocomplete="off"
					label="RCON Password"
					value={$store.values.rcon_password || ""}
					error={$store.errors.rcon_password}
					on:input={onChange}
				/>
			</form>
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={(e) => submit(e, close)}>Save Changes</Button>
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
		width: auto;

		.form {
			margin-top: 1rem;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-column-gap: 1rem;

			@include respond-below(sm) {
				grid-template-columns: 1fr;
				grid-column-gap: 0;
				grid-template-rows: 1fr 1fr;
			}
		}

		@include respond-below(sm) {
			min-width: 100%;
			width: 100%;
		}
	}
</style>
