<script>
	import RequirePerms from "../../components/RequirePerms.svelte"
	import { FLAG_SUPER_ADMIN } from "../../permissions/permissions"
	import { Link, navigate } from "svelte-routing"
	import Heading from "../../components/Heading.svelte"
	import Container from "./components/Container.svelte"
</script>

<Container style="max-height: unset;">
	<div class="settings">
		<a
			class="card groups"
			href="/settings/groups"
			on:click|preventDefault={() => navigate("/settings/groups")}
		>
			<span class="fas fa-lock" />
			<Heading type="subtitle">Groups</Heading>
		</a>

		<a
			class="card users"
			href="/settings/users"
			on:click|preventDefault={() => navigate("/settings/users")}
		>
			<span class="fas fa-users" />
			<Heading type="subtitle">Users</Heading>
		</a>

		<a
			class="card flagged-words"
			href="/settings/chat/flagged"
			on:click|preventDefault={() => navigate("/settings/chat/flagged")}
		>
			<span class="fas fa-comments" />
			<Heading type="subtitle">Flagged Words</Heading>
		</a>

		<RequirePerms allOf={[FLAG_SUPER_ADMIN]} adminBypass={false}>
			<a
				class="card game-settings"
				href="/settings/games"
				on:click|preventDefault={() => navigate("/settings/games")}
			>
				<span class="fas fa-gamepad" />
				<Heading type="subtitle">Games</Heading>
			</a>
		</RequirePerms>
	</div>
</Container>

<style lang="scss">
	@import "../../mixins/mixins.scss";

	.settings {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;

		.card {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			border-radius: var(--border-md);
			background-color: var(--color-background2);
			width: clamp(25rem, 20vw, 33.3vw);
			height: clamp(25rem, 20vw, 33.3vw);
			margin: 2rem;
			padding: 12rem 0;
			cursor: pointer;
			transition: 0.2s all;
			color: var(--color-text2);

			span {
				font-size: 8rem;
				margin-bottom: 2rem;
			}

			&:hover {
				background-color: var(--color-background1);
			}

			@include respond-below(xs) {
				width: 100%;
				height: auto;
				padding: 5rem;

				span {
					margin-bottom: 0;
				}
			}
		}
	}
</style>
