<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import { createUser } from "../../domain/user/store"
	import type { UserTraits } from "../../domain/user/user.types"
	import { reduceYupErrors } from "../../utils/yup"

	import Button from "../Button.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"

	type fields = {
		values: {
			email?: string
			username?: string
		}
		errors: {
			email?: string
			username?: string
		}
	}

	const store = writable({
		values: {
			email: "",
			username: "",
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

	const schema = yup.object().shape({
		email: yup
			.string()
			.trim()
			.required("Email is required")
			.email("Invalid email"),
		username: yup
			.string()
			.trim()
			.required("Username is required")
			.min(1, "Must be no less than 1 character in length")
			.max(20, "Must be nore more than 20 characters in length"),
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
		const errors = await createUser(values as UserTraits)
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
		<div class="header">Invite New User</div>
	</div>
	<div slot="content">
		<div class="content">
			<p>
				When you invite a new user, they will have to set a password and verify
				their email. The steps to do this are sent to them via email.
			</p>

			<p>
				When their account is all set up, they will be given the base role
				(Everyone) by default.
			</p>

			<form class="form" on:submit={submit}>
				<TextInput
					name="email"
					autocomplete="off"
					label="Email"
					value={$store.values.email}
					error={$store.errors.email}
					required
					on:input={onChange}
				/>

				<TextInput
					name="username"
					autocomplete="off"
					label="Username"
					value={$store.values.username}
					error={$store.errors.username}
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
