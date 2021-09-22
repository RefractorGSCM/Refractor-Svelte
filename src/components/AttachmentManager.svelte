<script lang="ts">
	import type { Attachment } from "../domain/attachment/attachment.types"
	import { truncate } from "../utils/strings"
	import Button from "./Button.svelte"
	import AttachmentModal from "./Modals/AttachmentModal.svelte"

	export let attachments = [] as Attachment[]

	function addAttachment(attachment: Attachment) {
		attachments = [...attachments, attachment]
	}

	function removeAttachment(index: number) {
		attachments = attachments.filter((_, idx) => index !== idx)
	}
</script>

<div class="attachments">
	{#if attachments.length > 0}
		<p>Attachments</p>

		{#each attachments as attachment, idx}
			<div class="attachment">
				<a href={attachment.url}>{truncate(attachment.url, 75)}</a>
				<span on:click={() => removeAttachment(idx)}>x</span>
			</div>
		{/each}
	{/if}

	<AttachmentModal on:submit={({ detail }) => addAttachment(detail)}>
		<div slot="trigger" let:open>
			<Button size="inline" on:click={open}>Attach Image</Button>
		</div>
	</AttachmentModal>
</div>

<style lang="scss">
	.attachments {
		p {
			margin-bottom: 0.5rem;
		}

		:global(.btn) {
			margin-top: 0.5rem;
		}

		.attachment {
			display: flex;
			margin-bottom: 2px;

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

			a {
				color: var(--color-primary);
				text-decoration: underline;
			}
		}
	}
</style>
