<script lang="ts">
	import { onMount } from "svelte"
	import tooltip from "../../actions/tooltip"
	import Heading from "../../components/Heading.svelte"
	import Spinner from "../../components/Spinner.svelte"
	import { self } from "../../domain/auth/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import { getStats } from "../../domain/stats/store"
	import Container from "./components/Container.svelte"

	let stats: Stats
	onMount(async () => {
		setLoading("stats", true)
		stats = await getStats()
		setLoading("stats", false)
	})

	function getTimeWord() {
		let currentHour = new Date().getHours()

		if (currentHour < 6 || currentHour > 20) {
			return "night"
		} else if (currentHour < 12) {
			return "morning"
		} else if (currentHour < 17) {
			return "afternoon"
		} else {
			return "evening"
		}

		return "day"
	}

	let flaggedMessageCountLabelColor = "inherit;"
	$: {
		if (!stats) {
			flaggedMessageCountLabelColor = "inherit"
		} else if (stats.total_flagged_chat_messages < 50) {
			flaggedMessageCountLabelColor = "var(--color-success)"
		} else if (stats.total_flagged_chat_messages < 150) {
			flaggedMessageCountLabelColor = "var(--color-warning)"
		} else {
			flaggedMessageCountLabelColor = "var(--color-danger)"
		}
	}
</script>

<svelte:head>
	<title>Refractor - Home</title>
</svelte:head>

{#if $loading["stats"]}
	<Spinner noBackground />
{:else}
	<Container>
		<div class="heading">
			<Heading type="title">Good {getTimeWord()}, {$self.username}.</Heading>
		</div>

		<div class="stats-wrapper">
			<div class="stats">
				<div class="stat total-players">
					<div class="count">{stats?.total_players}</div>
					<div class="label">Players</div>
					<div class="note">total</div>
				</div>
				<div class="stat new-players">
					<div class="count">{stats?.new_players_last_day}</div>
					<div class="label">New Players</div>
					<div class="note">in the last 24 hours</div>
				</div>
				<div class="stat unique-players">
					<div class="count">{stats?.unique_players_last_day}</div>
					<div class="label">Unique Players</div>
					<div class="note">in the last 24 hours</div>
				</div>
				<div class="stat total-infractions">
					<div class="count">{stats?.total_infractions}</div>
					<div class="label">Infractions</div>
					<div class="note">total</div>
				</div>
				<div class="stat new-infractions">
					<div class="count">{stats?.new_infractions_last_day}</div>
					<div class="label">New Infractions</div>
					<div class="note">in the last 24 hours</div>
				</div>
				<div class="stat total-chatmessages">
					<div class="count">{stats?.total_chat_messages}</div>
					<div class="label">Chat Messages</div>
					<div class="note">total</div>
				</div>
				<div class="stat new-chatmessages">
					<div class="count">{stats?.new_chat_messages_last_day}</div>
					<div class="label">New Chat Messages</div>
					<div class="note">in the last 24 hours</div>
				</div>
				<div class="stat total-flaggedmessages">
					<div class="count" style={`color: ${flaggedMessageCountLabelColor};`}>
						{stats?.total_flagged_chat_messages}
					</div>
					<div class="label">Flagged Messages</div>
					<div class="note">pending moderation</div>
				</div>
			</div>

			<div class="notice" use:tooltip={"stats are cached for 120 seconds"}>
				caching notice
			</div>
		</div>
	</Container>
{/if}

<style lang="scss">
	@import "../../mixins/mixins.scss";

	.heading {
		margin-bottom: 1rem;
	}

	.stats-wrapper {
		min-height: 50vh;

		.notice {
			display: inline-block;
			margin-top: 1rem;
			color: var(--color-text-muted2);
		}
	}

	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		column-gap: 2rem;
		row-gap: 2rem;

		@include respond-below(xl) {
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}

		@include respond-below(lg) {
			grid-template-columns: 1fr 1fr 1fr;
		}

		@include respond-below(md) {
			grid-template-columns: 1fr 1fr;
		}

		@include respond-below(xs) {
			grid-template-columns: 1fr;
		}

		.stat {
			position: relative;
			padding: 2.5rem 1rem 3.5rem 1rem;
			background-color: var(--color-background2);
			border-radius: var(--border-md);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-shadow: 0px 18px 35px -16px rgba(0, 0, 0, 0.8);

			@include respond-below(xl) {
				padding: 1.5rem 1rem 2.5rem 1rem;
			}

			.count {
				font-size: 6rem;
				font-weight: 300;

				@include respond-below(xl) {
					font-size: 5rem;
				}
			}

			.label {
				text-transform: uppercase;
				font-size: 2rem;
				color: var(--color-primary-light);

				@include respond-below(xl) {
					font-size: 1.6rem;
				}
			}

			.note {
				position: absolute;
				font-size: 1.4rem;
				bottom: 1.6rem;
				color: var(--color-text-muted2);

				@include respond-below(xl) {
					font-size: 1.2rem;
					bottom: 1rem;
				}
			}
		}
	}

	.flagged-messages {
		.heading {
			margin-top: 3rem;
			margin-bottom: 1rem;
		}

		.list {
			.message {
				min-height: 2rem;
				font-size: 1.6rem;
				display: grid;
				grid-template-columns: 1fr 3fr auto;
				grid-template-rows: minmax(2rem 4rem);
				width: 100%;
				align-items: center;
				padding: 0.5rem 2rem;

				&:nth-child(odd) {
					background-color: var(--color-background2);
				}

				.player {
					color: var(--color-text2);
					text-decoration: underline;
					transition: all 0.2s;

					&:hover {
						color: var(--color-primary-light);
					}
				}

				.msg {
				}

				.actions {
					display: flex;

					:global(.btn:first-child) {
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
					}

					:global(.btn:last-child) {
						border-top-left-radius: 0;
						border-bottom-left-radius: 0;
					}
				}
			}
		}
	}
</style>
