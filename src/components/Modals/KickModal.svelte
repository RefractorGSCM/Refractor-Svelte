<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import { createKick, updateInfraction } from "../../domain/infraction/store"
	import { updateServer } from "../../domain/server/store"
	import Server from "../../routes/dashboard/Server.svelte"
	import { filterEmptyStrings } from "../../utils/filters"
	import { reduceYupErrors } from "../../utils/yup"
	import AttachmentManager from "../AttachmentManager.svelte"

	import Button from "../Button.svelte"
	import ServerSelector from "../ServerSelector.svelte"
	import TextArea from "../TextArea.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"

	export let initialValues: CreateKickParams = {}
	export let player: Player
	export let serverId: number = null
	export let mode = "create"
	export let infractionId: number = null
	export let linkedChatMessages: number[] = null

	let serverIdProvided = !!serverId

	const dispatch = createEventDispatcher()

	type fields = {
		values: {
			reason?: string
			serverId?: string | number
			attachments?: Attachment[]
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
			attachments: [],
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

		let res: InfractionModifyRes = null
		switch (mode) {
			case "create":
				res = await create(values)
				break
			case "edit":
				res = await update(values)
				break
		}

		const { infraction, success, errors } = res

		if (!success) {
			store.set({
				...$store,
				...errors,
			})
		}

		// Close the form on success
		if (success) {
			dispatch("submit", infraction)
			close()
		}
	}

	async function create(values): Promise<InfractionModifyRes> {
		// Create infraction and report any errors back
		return await createKick(Number(values.serverId), {
			...values,
			player_id: player.id,
			platform: player.platform,
			linked_chat_messages: linkedChatMessages || [],
		})
	}

	async function update(values): Promise<InfractionModifyRes> {
		// Update the infraction and report any errors back
		return await updateInfraction(infractionId, {
			reason: values.reason,
		})
	}
</script>

<Modal on:close={cleanup}>
	<div slot="trigger" let:open>
		<slot name="trigger" openKick={open} {open} />
	</div>
	<div slot="header">
		<div class="header">
			{mode === "create" ? `New Kick for ${player.name}` : "Editing Kick"}
		</div>
	</div>
	<div slot="content">
		<div class="content">
			<form class="form" on:submit|preventDefault={() => {}}>
				{#if !serverIdProvided}
					<ServerSelector
						name="serverId"
						label="Server"
						required
						platform={player.platform}
						on:change={(e) =>
							onChange({ target: { name: "serverId", value: e.detail } })}
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

			{#if mode === "create"}
				<AttachmentManager bind:attachments={$store.values.attachments} />
			{/if}
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={(e) => submit(e, close)}
			>{mode === "create" ? "Log Kick" : "Update Kick"}</Button
		>
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
		max-width: 60rem;
		width: clamp(40rem, 60vw, 60rem);

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
