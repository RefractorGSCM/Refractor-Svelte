<script lang="ts">
	import { onMount } from "svelte"

	import Heading from "../../components/Heading.svelte"
	import { self } from "../../domain/auth/store"
	import type { Stats } from "../../domain/stats/stats.types"
	import { getStats } from "../../domain/stats/store"
	import Container from "./components/Container.svelte"

	let stats: Stats
	onMount(async () => {
		stats = await getStats()
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
</script>

<Container>
	<div class="heading">
		<Heading type="title">Good {getTimeWord()}, {$self.username}.</Heading>
	</div>

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
	</div>
</Container>

<style lang="scss">
	.heading {
		margin-bottom: 2rem;
	}

	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		column-gap: 2rem;
		row-gap: 2rem;

		.stat {
			position: relative;
			padding: 1.5rem 1rem 2.5rem 1rem;
			background-color: var(--color-background2);
			border-radius: var(--border-sm);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-shadow: 0px 18px 35px -16px rgba(0, 0, 0, 0.8);

			.count {
				font-size: 5rem;
				font-weight: 300;
			}

			.label {
				text-transform: uppercase;
				font-size: 1.4rem;
				color: var(--color-primary-light);
			}

			.note {
				position: absolute;
				bottom: 1rem;
				color: var(--color-text-muted2);
			}
		}
	}
</style>
