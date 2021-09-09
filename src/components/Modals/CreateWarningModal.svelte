<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import * as yup from "yup"
	import type {
		Attachment,
		CreateBanParams,
		CreateWarningParams,
	} from "../../domain/infraction/infraction.types"
	import { createWarning } from "../../domain/infraction/store"
	import type { Player } from "../../domain/player/player.types"
	import { updateServer } from "../../domain/server/store"
	import { filterEmptyStrings } from "../../utils/filters"
	import { reduceYupErrors } from "../../utils/yup"

	import Button from "../Button.svelte"
	import Heading from "../Heading.svelte"
	import ServerSelector from "../ServerSelector.svelte"
	import TextArea from "../TextArea.svelte"
	import TextInput from "../TextInput.svelte"
	import AttachmentModal from "./AttachmentModal.svelte"
	import Modal from "./Modal.svelte"

	export let initialValues: CreateWarningParams = {}
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

	let attachments = writable([] as Attachment[])

	function addAttachment(attachment: Attachment) {
		attachments.update((current) => {
			current.push(attachment)
			return current
		})
	}

	function removeAttachment(index: number) {
		attachments.update((current) => {
			current.splice(index, 1)
			return current
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

		// Create infraction and report any errors back
		const { infraction, success, errors } = await createWarning(
			Number(values.serverId),
			{
				...values,
				player_id: player.id,
				platform: player.platform,
				attachments: $attachments,
			},
		)

		if (!success) {
			store.set({
				...$store,
				...errors,
			})
		}

		// Close the form on success
		if (success) {
			close()
		}
	}
</script>

<Modal on:close={cleanup} fullWidth>
	<div slot="trigger" let:open>
		<slot name="trigger" openWarning={open} />
	</div>
	<div slot="header">
		<div class="header">New Warning for {player.name}</div>
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
			</form>

			<div class="attachments">
				{#if $attachments.length > 0}
					<p>Attachments</p>

					{#each $attachments as attachment, idx}
						<div class="attachment">
							{attachment.url}
							<span on:click={() => removeAttachment(idx)}>x</span>
						</div>
					{/each}
				{/if}

				<AttachmentModal on:submit={({ detail }) => addAttachment(detail)}>
					<div slot="trigger" let:open>
						<Button size="inline" on:click={open}>Attach URL</Button>
					</div>
				</AttachmentModal>
			</div>
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button color="danger" on:click={close}>Cancel</Button>
		<Button on:click={(e) => submit(e, close)}>Log Warning</Button>
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

	.attachments {
		.attachment {
			display: flex;

			span {
				background-color: var(--color-primary);
				border-radius: var(--border-sm);
				width: 2rem;
				height: 2rem;
				display: grid;
				place-items: center;
				margin-left: 1rem;

				&:hover {
					background-color: var(--color-primary-light);
					cursor: pointer;
				}
			}
		}
	}
</style>
