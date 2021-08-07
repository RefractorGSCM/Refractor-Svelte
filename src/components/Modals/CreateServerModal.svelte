<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import type { CreateServerParams } from "../../domain/server/server.types"
	import { createServer } from "../../domain/server/store"
	import { createUser } from "../../domain/user/store"
	import type { UserTraits } from "../../domain/user/user.types"
	import { reduceYupErrors } from "../../utils/yup"

	import Button from "../Button.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"

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

	const dispatch = createEventDispatcher()

	function onChange({ target }) {
		store.set({
			...$store,
			values: {
				...$store.values,
				[target.name]: target.value,
			},
		})
	}

	function onPortKeyDown(e) {
		var regex = /[0-9]|\./
		if (!regex.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
			if (e.preventDefault) e.preventDefault()
		}
	}

	const schema = yup.object().shape({
		game: yup.string().trim().required("Game is required"),
		name: yup
			.string()
			.trim()
			.required("Name is required")
			.min(1, "Must be no less than 1 character in length")
			.max(20, "Must be nore more than 20 characters in length"),
		address: yup
			.string()
			// @ts-ignore
			.ipv4()
			.required("RCON address is required"),
		rcon_port: yup
			.string()
			.required("RCON port is required")
			.test("min", "Port number can't be less than 1", (val) => {
				const num = parseInt(val)

				if (num > 0) {
					return true
				}

				return false
			})
			.test("max", "Port number can't be greater than 65535", (val) => {
				const num = parseInt(val)

				if (num <= 65535) {
					return true
				}

				return false
			}),
		rcon_password: yup
			.string()
			.trim()
			.required("RCON password is required")
			.min(1, "Must be no less than 1 character in length")
			.max(128, "Must be no more than 128 characters in length"),
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

		// Create user and report any errors back
		const errors = await createServer(values as CreateServerParams)
		store.set({
			...$store,
			errors,
		})

		// If no errors were returned, the user creation succeeded. Close the form.
		if (!errors) {
			close()
		}
	}
</script>

<Modal>
	<div slot="trigger" let:open>
		<slot name="trigger" {open} />
	</div>
	<div slot="header">
		<div class="header">Add Server</div>
	</div>
	<div slot="content">
		<div class="content">
			<form class="form" on:submit|preventDefault={() => {}}>
				<TextInput
					name="game"
					autocomplete="off"
					label="Game"
					value={$store.values.game}
					error={$store.errors.game}
					required
					on:input={onChange}
				/>

				<TextInput
					name="name"
					autocomplete="off"
					label="Name"
					value={$store.values.name}
					error={$store.errors.name}
					required
					on:input={onChange}
				/>

				<TextInput
					name="address"
					autocomplete="off"
					label="RCON Address"
					value={$store.values.address}
					error={$store.errors.address}
					required
					on:input={onChange}
				/>

				<TextInput
					name="rcon_port"
					autocomplete="off"
					label="RCON Port"
					type="number"
					value={$store.values.rcon_port}
					error={$store.errors.rcon_port}
					required
					on:keydown={onPortKeyDown}
					on:input={onChange}
				/>

				<TextInput
					name="rcon_password"
					autocomplete="off"
					label="RCON Password"
					value={$store.values.rcon_password}
					error={$store.errors.rcon_password}
					required
					on:input={onChange}
				/>
			</form>
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={(e) => submit(e, close)}>Invite User</Button>
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
		width: 70rem;

		p {
			margin-bottom: 1rem;
		}

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
