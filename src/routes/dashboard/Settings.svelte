<script>
	import { Link } from "svelte-routing"
	import Heading from "../../components/Heading.svelte"
	import Container from "./components/Container.svelte"
</script>

<Container>
	<div class="settings">
		<Link to="/settings/groups">
			<div class="card groups">
				<span class="fas fa-lock" />
				<Heading type="subtitle">Groups</Heading>
			</div>
		</Link>

		<Link to="/settings/users">
			<div class="card users">
				<span class="fas fa-users" />
				<Heading type="subtitle">Users</Heading>
			</div>
		</Link>

		<Link to="/settings/chat/flagged">
			<div class="card flagged-words">
				<span class="fas fa-comments" />
				<Heading type="subtitle">Flagged Words</Heading>
			</div>
		</Link>
	</div>
</Container>

<style lang="scss">
	.settings {
		display: flex;
		justify-content: center;
		align-items: center;

		.card {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			border-radius: var(--border-md);
			background-color: var(--color-background2);
			width: 40rem;
			height: 40rem;
			margin: 2rem;
			padding: 12rem 0;
			cursor: pointer;
			transition: 0.2s all;
			color: var(--color-text2);

			span {
				font-size: 8rem;
			}

			&:hover {
				background-color: var(--color-background1);
			}
		}
	}
</style>
