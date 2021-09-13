<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import type { Attachment } from "../../domain/attachment/attachment.types"
	import type {
		CreateBanParams,
		CreateMuteParams,
		InfractionModifyRes,
	} from "../../domain/infraction/infraction.types"
	import { createMute, updateInfraction } from "../../domain/infraction/store"
	import type { Player } from "../../domain/player/player.types"
	import type { UpdateServerParams } from "../../domain/server/server.types"
	import { updateServer } from "../../domain/server/store"
	import Server from "../../routes/dashboard/Server.svelte"
	import { filterEmptyStrings } from "../../utils/filters"
	import { reduceYupErrors } from "../../utils/yup"
	import AttachmentManager from "../AttachmentManager.svelte"

	import Button from "../Button.svelte"
	import DurationPicker from "../DurationPicker.svelte"
	import ServerSelector from "../ServerSelector.svelte"
	import TextArea from "../TextArea.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"

	export let initialValues: CreateMuteParams = {}
	export let player: Player
	export let serverId: number = null
	export let mode = "create"
	export let infractionId: number = null

	let serverIdProvided = !!serverId

	const dispatch = createEventDispatcher()

	type fields = {
		values: {
			reason?: string
			duration?: number | string
			serverId?: number | string
			attachments?: Attachment[]
		}
		errors: {
			reason?: string
			duration?: string
			serverId?: string
		}
	}

	const store = writable({
		values: {
			reason: "",
			duration: "",
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
				duration: "",
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

	function setDuration(duration: number) {
		store.set({
			...$store,
			values: {
				...$store.values,
				duration,
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
		duration: yup
			.number()
			.transform((val) => (isNaN(val) ? undefined : val))
			.min(0, "Must not be less than 0")
			.max(maxInt32, "Must not be higher than 2,147,483,647")
			.required("Duration is required"),
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
		return await createMute(Number(values.serverId), {
			reason: values.reason,
			duration: Number(values.duration),
			player_id: player.id,
			platform: player.platform,
			attachments: values.attachments,
		})
	}

	async function update(values): Promise<InfractionModifyRes> {
		// Update the infraction and report any errors back
		return await updateInfraction(infractionId, {
			reason: values.reason,
			duration: values.duration,
		})
	}
</script>

<Modal on:close={cleanup} fullWidth>
	<div slot="trigger" let:open>
		<slot name="trigger" openMute={open} {open} />
	</div>
	<div slot="header">
		<div class="header">
			{mode === "create" ? `New Mute for ${player.name}` : "Editing Mute"}
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

				<DurationPicker
					name="duration"
					label="Duration"
					value={typeof $store.values.duration === "number"
						? $store.values.duration
						: null}
					on:change={({ detail: val }) => setDuration(val)}
					required
					error={$store.errors.duration}
					quickselects={[
						{
							name: "permanent",
							value: 0,
						},
						{
							name: "1 min",
							value: 1,
						},
						{
							name: "30 mins",
							value: 30,
						},
						{
							name: "1 hour",
							value: 60,
						},
						{
							name: "12 hours",
							value: 720,
						},
						{
							name: "1 day",
							value: 1440,
						},
						{
							name: "1 week",
							value: 10080,
						},
						{
							name: "1 month",
							value: 43800,
						},
					]}
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
			>{mode === "create" ? "Log Mute" : "Update Mute"}</Button
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
