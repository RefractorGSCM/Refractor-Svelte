<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"
	import Button from "../Button.svelte"
	import TextInput from "../TextInput.svelte"
	import Modal from "./Modal.svelte"
	import * as yup from "yup"
	import { reduceYupErrors } from "../../utils/yup"
	import TextArea from "../TextArea.svelte"

	const dispatch = createEventDispatcher()

	type values = {
		url?: string
		note?: string
	}

	type errors = {
		url?: string
		note?: string
	}

	type store = {
		values: values
		errors: errors
	}

	let store = writable({
		values: {
			url: "",
			note: "",
		},
		errors: {
			url: "",
			note: "",
		},
	} as store)

	function cleanup() {
		store.set({
			values: {
				url: "",
				note: "",
			},
			errors: {
				url: "",
				note: "",
			},
		})
	}

	const schema = yup.object().shape({
		url: yup
			.string()
			.url("Invalid URL")
			.test("image-url", "URL must point to an image", (url) => {
				return url.match(/\.(jpeg|jpg|gif|png)$/) != null
			})
			.required("URL is a required field"),
		note: yup
			.string()
			.min(0)
			.max(256, "Note must be no more than 256 characters in length"),
	})

	function onChange({ target }) {
		store.set({
			...$store,
			values: {
				...$store.values,
				[target.name]: target.value,
			},
		})
	}

	async function submit(close) {
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

		dispatch("submit", values)
		close()
	}
</script>

<Modal on:close={cleanup}>
	<div slot="trigger" let:open>
		<slot name="trigger" {open} />
	</div>
	<div slot="header">
		<div class="header">Add Image</div>
	</div>
	<div slot="content">
		<div class="content">
			<TextInput
				name="url"
				label="Image URL"
				required
				value={$store.values.url}
				error={$store.errors.url}
				on:input={onChange}
			/>
			<TextArea
				name="note"
				label="Note (optional)"
				value={$store.values.note}
				error={$store.errors.note}
				minRows={1}
				maxRows={3}
				on:input={onChange}
			/>
		</div>
	</div>

	<div slot="footer" class="buttons" let:store={{ close }}>
		<Button on:click={close}>Cancel</Button>
		<Button color="danger" on:click={() => submit(close)}>Done</Button>
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
		min-width: 50rem;
		max-width: 55rem;

		@include respond-below(sm) {
			min-width: 100%;
			width: 100%;
		}
	}
</style>
