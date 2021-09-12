<script lang="ts">
	import { onMount } from "svelte"
	import { Link } from "svelte-routing"
	import AttachmentManager from "../../components/AttachmentManager.svelte"
	import Heading from "../../components/Heading.svelte"
	import type { Infraction } from "../../domain/infraction/infraction.types"
	import { getInfractionById } from "../../domain/infraction/store"
	import type { Player } from "../../domain/player/player.types"
	import { getPlayer } from "../../domain/player/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let id

	let infraction: Infraction = null
	let player: Player = null
	onMount(async () => {
		infraction = await getInfractionById(id)

		if (infraction) {
			player = await getPlayer(infraction.player_id, infraction.platform)

			console.log("PLAYER", player)
		}
	})
</script>

<Container>
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

		{#if infraction.attachments && infraction.attachments.length > 0}
			<SinglePane>
				<div class="attachments">
					<div class="attachments--heading">
						<Heading>Attachments</Heading>
					</div>

					<div class="attachments--list">
						{#each infraction.attachments as attachment}
							<div class="attachments--attachment">
								<img src={attachment.url} alt="attachment" />
								<span>{attachment.note}</span>
							</div>
						{/each}
					</div>
				</div>
			</SinglePane>
		{/if}
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
			grid-template-columns: 1fr 1fr 1fr 1fr;
			column-gap: 2rem;
		}

		&--attachment {
			img {
				max-width: 100%;
			}
		}
	}
</style>
