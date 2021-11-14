<script lang="ts">
	import { onMount } from "svelte"
	import { Link, navigate } from "svelte-routing"
	import { writable } from "svelte/store"
	import Button from "../../components/Button.svelte"
	import DurationDisplay from "../../components/DurationDisplay.svelte"
	import Heading from "../../components/Heading.svelte"
	import AttachmentModal from "../../components/Modals/AttachmentModal.svelte"
	import BanModal from "../../components/Modals/BanModal.svelte"
	import ConfirmModal from "../../components/Modals/ConfirmModal.svelte"
	import KickModal from "../../components/Modals/KickModal.svelte"
	import MuteModal from "../../components/Modals/MuteModal.svelte"
	import WarningModal from "../../components/Modals/WarningModal.svelte"
	import NameDisplay from "../../components/NameDisplay.svelte"
	import {
		createAttachment,
		deleteAttachment,
	} from "../../domain/attachment/store"
	import { isAdmin, isSuperAdmin, self } from "../../domain/auth/store"
	import {
		deleteInfraction,
		getInfractionById,
		setInfractionRepealed,
		updateInfraction,
	} from "../../domain/infraction/store"
	import { getPlayer } from "../../domain/player/store"
	import {
		allServers,
		fragmentServers,
		getServerPermissions,
	} from "../../domain/server/store"
	import {
		checkFlag,
		FLAG_DELETE_ANY_INFRACTIONS,
		FLAG_DELETE_OWN_INFRACTIONS,
		FLAG_EDIT_ANY_INFRACTIONS,
		FLAG_EDIT_OWN_INFRACTIONS,
		FLAG_VIEW_PLAYER_RECORDS,
		getFlag,
	} from "../../permissions/permissions"
	import { dateString } from "../../utils/date"
	import { successToast } from "../../utils/toast"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let id

	let infraction: Infraction = null
	let attachments = writable([] as Attachment[])
	let access = writable(
		{} as {
			canEdit?: boolean
			canDelete?: boolean
		},
	)
	let player: Player = null
	let editComponent
	let computedPermissions = null

	onMount(async () => {
		infraction = await getInfractionById(id)

		if (!infraction) {
			return
		}

		if (infraction.attachments) attachments.set(infraction.attachments)

		// If this user has permission to view player records, fetch the player.
		// If they don't have permission, the player's ID will be displayed instead of their name.
		if (checkFlag($self.permissions, getFlag(FLAG_VIEW_PLAYER_RECORDS))) {
			player = await getPlayer(infraction.player_id, infraction.platform)
		}

		switch (infraction.type) {
			case "WARNING":
				editComponent = WarningModal
				break
			case "MUTE":
				editComponent = MuteModal
				break
			case "KICK":
				editComponent = KickModal
				break
			case "BAN":
				editComponent = BanModal
				break
		}

		// Get computed user permissions scoped to this server
		const perms = await getServerPermissions(infraction.server_id)
		computedPermissions = writable(perms as bigint)

		// Determine edit and delete access
		access.set({
			canEdit: allowEditing(),
			canDelete: allowDeletion(),
		})
	})

	async function addAttachment(attachment: CreateAttachmentParams) {
		const res = await createAttachment(infraction.id, attachment)

		if (!res.success) {
			return
		}

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

	async function deleteCurrentInfraction() {
		const success = await deleteInfraction(infraction.id)

		if (success) {
			navigate(`/player/${player.platform}/${player.id}`)
		}
	}

	async function repealCurrentInfraction() {
		const success = await setInfractionRepealed(infraction.id, true)

		if (success) {
			successToast("Infraction repealed")
			infraction.repealed = true

			access.set({
				canEdit: false,
				canDelete: allowDeletion(),
			})
		}
	}

	function getServerName(): string {
		const serverId = infraction.server_id

		let server = $allServers.find((s) => s.id === serverId)
		if (server) return server.name

		server = $fragmentServers.find((s) => s.id === serverId)
		if (server) return server.name

		return serverId.toString()
	}

	function allowEditing(): boolean {
		// if this infraction is repealed, do not allow editing.
		if (infraction.repealed) {
			return false
		}

		// if the user created this infraction and they have permission to edit their own infractions then return true
		if (
			$self.id === infraction.user_id &&
			checkFlag($computedPermissions, getFlag(FLAG_EDIT_OWN_INFRACTIONS))
		) {
			return true
		}

		// if the user has permission to edit any infraction then return true
		if (checkFlag($computedPermissions, getFlag(FLAG_EDIT_ANY_INFRACTIONS))) {
			return true
		}

		// if the user is admin or super admin return true
		if ($isAdmin || $isSuperAdmin) {
			return true
		}

		return false
	}

	function allowDeletion(): boolean {
		// if the user created this infraction and they have permission to delete their own infractions then return true
		if (
			$self.id === infraction.user_id &&
			checkFlag($computedPermissions, getFlag(FLAG_DELETE_OWN_INFRACTIONS))
		) {
			return true
		}

		// if the user has permission to delete any infraction then return true
		if (checkFlag($computedPermissions, getFlag(FLAG_DELETE_ANY_INFRACTIONS))) {
			return true
		}

		// if the user is admin or super admin return true
		if ($isAdmin || $isSuperAdmin) {
			return true
		}

		return false
	}
</script>

<Container style={`max-height: unset;`}>
	{#if !infraction}
		<Heading>Infraction not found</Heading>
	{:else if !computedPermissions}
		<Heading>Fetching permissions...</Heading>
	{:else}
		<div class="heading">
			<Heading type="title"
				>Infraction {id}
				{#if infraction.repealed}
					<span class="repealed"> [REPEALED]</span>
				{/if}
			</Heading>
		</div>

		<SinglePane>
			<div class="head-wrapper">
				<div class="meta">
					<div class="meta--field">
						<span>Infraction ID:</span>
						{infraction.id}
					</div>
					<div class="meta--field">
						<span>Date:</span>
						{dateString(new Date(infraction.created_at))}
					</div>
					<div class="meta--field">
						<span>Platform:</span>
						{infraction.platform}
					</div>
					<div class="meta--field">
						<span>Player:</span>
						{#if player}
							<Link
								to={`/player/${infraction.platform}/${infraction.player_id}`}
								>{player.name}</Link
							>
						{:else}
							{infraction.player_id}
						{/if}
					</div>
					<div class="meta--field">
						<span>Issued by:</span>
						<NameDisplay userId={infraction.user_id}
							>{infraction.issuer_name}</NameDisplay
						>
					</div>
					<div class="meta--field">
						<span>Server:</span>
						<Link to={`/server/${infraction.server_id}`}>{getServerName()}</Link
						>
					</div>
				</div>

				<div class="buttons">
					{#if $access.canEdit}
						<svelte:component
							this={editComponent}
							mode="edit"
							{player}
							serverId={infraction.server_id}
							initialValues={{ ...infraction }}
							infractionId={infraction.id}
							on:submit={({ detail }) =>
								(infraction = {
									...infraction,
									reason: detail.reason,
									duration: detail.duration,
								})}
						>
							<div slot="trigger" let:open>
								<Button on:click={open}>Edit</Button>
							</div>
						</svelte:component>

						{#if !infraction.repealed}
							<ConfirmModal
								heading="Repeal Infraction"
								message={"Are you sure you wish to repeal this infraction? It will still be on record, but will marked specially and not shown prominently."}
								submitText="Repeal"
								on:submit={repealCurrentInfraction}
							>
								<div slot="trigger" let:open>
									<Button color="success" on:click={open}>Repeal</Button>
								</div>
							</ConfirmModal>
						{/if}
					{/if}

					{#if $access.canDelete}
						<ConfirmModal
							heading="Delete Infraction"
							message={"Are you sure you wish to delete this infraction? This action can not be undone."}
							on:submit={deleteCurrentInfraction}
						>
							<div slot="trigger" let:open>
								<Button color="danger" on:click={open}>Delete</Button>
							</div>
						</ConfirmModal>
					{/if}
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
						<DurationDisplay duration={infraction.duration} />
					</div>
				{/if}

				<div class="info--field reason">
					<span>Reason:</span>
					{infraction.reason}
				</div>

				{#if infraction.modified_at}
					<div class="info--field updated">
						<span>Last Updated:</span>
						{dateString(new Date(infraction.modified_at))}
					</div>
				{/if}
			</div>
		</SinglePane>

		{#if infraction.linked_chat_messages?.length > 0}
			<SinglePane>
				<div class="chatmessages">
					<div class="chatmessages--heading">
						<Heading>Referenced Chat Messages</Heading>
					</div>

					<div class="messages">
						{#each infraction.linked_chat_messages as msg}
							<div class="msg">
								<div class="id"><span class="label">ID: </span>{msg.id}</div>
								<div class="date">
									<span class="label">Date: </span>
									<span class="date"
										>{dateString(new Date(msg.created_at)).split(",")[0]}</span
									>
									<span class="time hidemobile"
										>{dateString(new Date(msg.created_at)).split(",")[1]}</span
									>
								</div>
								<div class="player">
									<span class="label">Player: </span>{msg.name}
								</div>
								<div class="text">{msg.message}</div>
							</div>
						{/each}
					</div>
				</div>
			</SinglePane>
		{/if}

		{#if $attachments?.length > 0 || $access.canEdit}
			<SinglePane>
				<div class="attachments">
					<div class="attachments--heading">
						<Heading>Attachments</Heading>
					</div>

					{#if $attachments && $attachments.length > 0}
						<div class="attachments--list">
							{#each $attachments as attachment}
								<div class="attachments--attachment">
									<ConfirmModal
										heading="Deleting attachment"
										message="Are you sure you want to delete this attachment?"
										on:submit={() => removeAttachment(attachment.id)}
									>
										<div slot="trigger" let:open>
											<div class="delete-btn">
												{#if $access.canEdit}
													<Button size="inline" color="danger" on:click={open}
														>x</Button
													>
												{/if}
											</div>
										</div>
									</ConfirmModal>
									<a href={attachment.url}>
										<img src={attachment.url} alt="attachment" />
									</a>
									<span>{attachment.note}</span>
								</div>
							{/each}
						</div>
					{/if}

					<AttachmentModal on:submit={({ detail }) => addAttachment(detail)}>
						<div slot="trigger" let:open>
							{#if $access.canEdit}
								<Button on:click={open}>Add Attachment</Button>
							{/if}
						</div>
					</AttachmentModal>
				</div>
			</SinglePane>
		{/if}
	{/if}
</Container>

<style lang="scss">
	@import "../../mixins/mixins.scss";

	.heading {
		margin-bottom: 2rem;
		display: flex;

		.repealed {
			margin-left: 1rem;
			color: var(--color-success);
		}
	}

	.head-wrapper {
		.meta {
			display: grid;
			grid-template-columns: auto auto auto auto auto;
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

		.buttons {
			display: flex;
			margin-top: 1rem;
			column-gap: 0.5rem;
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

	.chatmessages {
		width: 100%;

		&--heading {
			margin-bottom: 1rem;
		}

		.messages {
			display: flex;
			flex-direction: column;
			border-radius: var(--border-sm);

			.msg {
				display: grid;
				grid-template-columns: 1fr 2fr 2fr;
				grid-template-rows: 1fr auto;
				padding: 0.5rem 1rem;

				.label {
					color: var(--color-primary);
				}

				&:nth-child(odd) {
					background-color: var(--color-background2-dark);
				}

				.text {
					grid-column: span 4;
				}

				@include respond-below(sm) {
					grid-template-columns: 1fr;
					grid-template-rows: 1fr 1fr 1fr auto;

					.text {
						grid-column: span 1;
					}
				}
			}
		}

		@include respond-below(sm) {
			.hidemobile {
				display: none;
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
			display: flex;
			flex-direction: column;

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
