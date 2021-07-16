<script>
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import Container from "./components/Container.svelte"
</script>

<Container>
	<Heading type="title">Servers</Heading>

	<div>
		<div class="servers">
			<div class="heading">
				<div class="name">Name</div>
				<div class="players">Players</div>
				<div class="status">Status</div>
				<div class="actions" />
			</div>

			<div class="server">
				<div class="name">
					<span class="icon fas fa-server" />Jedi vs Sith - US East
				</div>
				<div class="players">32</div>
				<div class="status">Online</div>
				<div class="actions">
					<Button color="success" size="inline">Edit</Button>
					<Button color="danger" size="inline" classes={["server-action-last"]}>
						Delete
					</Button>
				</div>
			</div>
		</div>
	</div>
</Container>

<style lang="scss">
	@import "../../mixins/mixins.scss";

	.servers {
		margin-top: 1rem;
		display: grid;
		grid-row-gap: 1rem;
		grid-template-rows: auto;
		font-size: 1.8rem;

		@include respond-below(xl) {
			font-size: 1.6rem;
		}

		.server {
			display: grid;
			grid-template-columns: 1.2fr 1fr 1fr 0.4fr;
			grid-template-rows: auto;
			background-color: var(--color-background2);
			padding: 1rem 1.5rem;
			align-items: center;
			border-radius: var(--border-sm);
			transition: background-color 0.1s;

			&:hover {
				background-color: var(--color-background1);
				cursor: pointer;
			}

			@include respond-below(sm) {
				grid-template-columns: 1fr;

				.players {
					display: none;
				}

				.status {
					display: none;
				}

				.actions {
					display: none;
				}
			}
		}

		.name .icon {
			color: var(--color-primary);
			margin-right: 1rem;
		}

		.heading {
			display: grid;
			grid-template-columns: 1.2fr 1fr 1fr 0.4fr;
			grid-template-rows: auto;
			background-color: var(--color-accent);
			padding: 1rem;
			border-radius: var(--border-sm);

			@include respond-below(sm) {
				display: none;
			}
		}

		.actions {
			display: flex;
			justify-content: right;
		}

		:global(.server-action-last) {
			margin-left: 1rem;
		}
	}
</style>
