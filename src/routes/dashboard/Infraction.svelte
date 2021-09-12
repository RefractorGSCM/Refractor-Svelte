<script lang="ts">
	import { onMount } from "svelte"
	import { Link } from "svelte-routing"
	import { writable } from "svelte/store"
	import AttachmentManager from "../../components/AttachmentManager.svelte"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import AttachmentModal from "../../components/Modals/AttachmentModal.svelte"
	import DeleteModal from "../../components/Modals/DeleteModal.svelte"
	import type {
		Attachment,
		CreateAttachmentParams,
	} from "../../domain/attachment/attachment.types"
	import {
		createAttachment,
		deleteAttachment,
	} from "../../domain/attachment/store"
	import type { Infraction } from "../../domain/infraction/infraction.types"
	import { getInfractionById } from "../../domain/infraction/store"
	import type { Player } from "../../domain/player/player.types"
	import { getPlayer } from "../../domain/player/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let id

	let infraction: Infraction = null
	let attachments = writable([] as Attachment[])
	let player: Player = null
	onMount(async () => {
		infraction = await getInfractionById(id)

		if (infraction) {
			if (infraction.attachments) attachments.set(infraction.attachments)
			player = await getPlayer(infraction.player_id, infraction.platform)
		}
	})

	async function addAttachment(attachment: CreateAttachmentParams) {
		const res = await createAttachment(infraction.id, attachment)

		if (!res.success) {
			return
		}

		console.log("NEW ATTACHMENT", res.attachment)

		attachments.update((current) => {
			current.push(res.attachment)
			return current
		})
	}

	async function removeAttachment(id: number) {
		await deleteAttachment(id)

		attachments.update((current) => {
			return current.filter((att) => att.id !== id)
		})
	}
</script>

<Container style="max-height: unset;">
	{#if !infraction}
		<Heading>Infraction not found</Heading>
	{:else}
		<div class="heading">
			<Heading type="title">Infraction {id}</Heading>
		</div>

		<SinglePane>
			<div class="meta">
				<div class="meta--field">
					<span>Infraction ID:</span>
					{infraction.id}
				</div>
				<div class="meta--field">
					<span>Platform:</span>
					{infraction.platform}
				</div>
				{#if player}
					<div class="meta--field">
						<span>Player:</span>
						<Link to={`/player/${infraction.platform}/${infraction.player_id}`}
							>{player.name}</Link
						>
					</div>
				{/if}
				<div class="meta--field">
					<span>Issued by:</span>
					{infraction.issuer_name}
				</div>
			</div>
		</SinglePane>

		<SinglePane>
			<div class="info">
				<div class="info--heading">
					<Heading type="subtitle">{infraction.type.toLowerCase()}</Heading>
				</div>

				{#if infraction.duration}
					<div class="info--field duration">
						<span>Duration:</span>
						{infraction.duration} mins
					</div>
				{/if}

				<div class="info--field reason">
					<span>Reason:</span>
					{infraction.reason}
				</div>
			</div>
		</SinglePane>

		<SinglePane>
			<div class="attachments">
				<div class="attachments--heading">
					<Heading>Attachments</Heading>
				</div>

				{#if $attachments && $attachments.length > 0}
					<div class="attachments--list">
						{#each $attachments as attachment}
							<div class="attachments--attachment">
								<DeleteModal
									heading="Deleting attachment"
									message="Are you sure you want to delete this attachment?"
									on:submit={() => removeAttachment(attachment.id)}
								>
									<div slot="trigger" let:open>
										<div class="delete-btn">
											<Button size="inline" color="danger" on:click={open}
												>x</Button
											>
										</div>
									</div>
								</DeleteModal>
								<a href={attachment.url}>
									<img src={attachment.url} alt="attachment" />
								</a>
								<span>{attachment.note}</span>
							</div>
						{/each}
					</div>
				{/if}

				<AttachmentModal on:submit={({ detail }) => addAttachment(detail)}>
					createAttachment(detail)}>
					<div slot="trigger" let:open>
						<Button on:click={open}>Add Attachment</Button>
					</div>
				</AttachmentModal>
			</div>
		</SinglePane>
	{/if}
</Container>

<style lang="scss">
	@import "../../mixins/mixins.scss";

	.heading {
		margin-bottom: 2rem;
	}

	.meta {
		display: grid;
		grid-template-columns: auto auto auto auto;
		column-gap: 1.5rem;
		row-gap: 1.5rem;

		@include respond-below(md) {
			grid-template-columns: 1fr 1fr;
		}

		&--field {
			color: var(--color-text2);

			:global(a) {
				color: var(--color-text2);
				text-decoration: underline;
			}

			span {
				color: var(--color-primary);
			}
		}
	}

	.info {
		display: grid;

		&--heading {
			text-transform: capitalize;
			margin-bottom: 1rem;
		}

		&--field {
			span {
				display: inline-block;
				min-width: 8rem;
				color: var(--color-primary);
			}
		}
	}

	.attachments {
		&--heading {
			margin-bottom: 2rem;
		}

		&--list {
			display: grid;
			grid-template-columns: 1fr 1fr;
			column-gap: 1.5rem;

			@include respond-below(md) {
				grid-template-columns: 1fr;
			}
		}

		&--attachment {
			margin-top: 1rem;
			margin-bottom: 2rem;

			.delete-btn {
				:global(.btn) {
					width: 2rem;
					height: 2rem;
					padding: 0;
					z-index: 20;
				}
			}

			img {
				max-width: 100%;
				max-height: 40rem;
				transition: all 0.3s;
				cursor: pointer;
				z-index: 1;

				&:hover {
					transform: scale(1.05);
				}
			}

			span {
				display: inline-block;
				font-size: 1.3rem;
				color: var(--color-text-muted);
			}
		}
	}
</style>
