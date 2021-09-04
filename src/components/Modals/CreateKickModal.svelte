<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import type {
		CreateBanParams,
		CreateKickParams,
		CreateWarningParams,
	} from "../../domain/infraction/infraction.types"
	import type { Player } from "../../domain/player/player.types"
	import { updateServer } from "../../domain/server/store"
	import Server from "../../routes/dashboard/Server.svelte"
	import { filterEmptyStrings } from "../../utils/filters"
	import { reduceYupErrors } from "../../utils/yup"

	import Button from "../Button.svelte"
	import TextArea from "../TextArea.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"

	export let initialValues: CreateKickParams = {}
	export let player: Player
	export let serverId: number = null
	let serverIdProvided = !!serverId

	type fields = {
		values: {
			reason?: string
			serverId?: string | number
		}
		errors: {
			reason?: string
			serverId?: string
		}
	}

	const store = writable({
		values: {
			reason: "",
			serverId: serverId || "",
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
				reason: "",
				serverId: serverId || "",
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

	function onDurationKeyDown(e) {
		var regex = /[0-9]|\./
		if (!regex.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
			if (e.preventDefault) e.preventDefault()
		}
	}

	const maxInt32 = 2147483647
	const schema = yup.object().shape({
		serverId: yup
			.number()
			.min(1, "Must be greater than 0")
			.max(maxInt32, "Must be no higher than 2,147,483,647")
			.required("Server is required"),
		reason: yup
			.string()
			.trim()
			.min(1, "Must be at least 1 character in length")
			.max(1024, "Must be no more than 1024 characters in length")
			.required("Reason is required"),
		duration: yup
			.number()
			.min(0, "Must not be less than 0")
			.max(maxInt32, "Must not be higher than 2,147,483,647"),
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

		console.log("Submitting", values)

		// Create user and report any errors back
		// const errors = await createServer(values as CreateBanParams)
		// store.set({
		// 	...$store,
		// 	errors,
		// })

		// // If no errors were returned, the user creation succeeded. Close the form.
		// if (!errors) {
		// 	close()
		// }
	}
</script>

<Modal on:close={cleanup} fullWidth>
	<div slot="trigger" let:open>
		<slot name="trigger" openKick={open} />
	</div>
	<div slot="header">
		<div class="header">New Kick for {player.name}</div>
	</div>
	<div slot="content">
		<div class="content">
			<form class="form" on:submit|preventDefault={() => {}}>
				{#if !serverIdProvided}
					<TextInput
						name="serverId"
						label="Server"
						value={$store.values.serverId.toString()}
						error={$store.errors.serverId}
						required
						on:input={onChange}
					/>
				{/if}

				<TextArea
					name="reason"
					label="Reason"
					required
					value={$store.values.reason}
					error={$store.errors.reason}
					minRows={2}
					maxRows={6}
					on:input={onChange}
				/>
			</form>
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={(e) => submit(e, close)}>Log Kick</Button>
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
		width: 100%;

		.form {
			margin-top: 1rem;
			display: grid;
			grid-template-columns: 1fr;
			grid-row-gap: 1rem;
		}

		@include respond-below(sm) {
			min-width: 100%;
			width: 100%;
		}
	}
</style>
