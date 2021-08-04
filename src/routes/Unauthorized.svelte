<script>
	import Button from "../components/Button.svelte"
	import Heading from "../components/Heading.svelte"

	function redirectToRecovery() {
		window.location.replace(`${AUTH_ROOT}/k/verify`)
	}
</script>

<div class="wrapper">
	<div class="container">
		<div>
			<Heading type="title">UNAUTHORIZED</Heading>

			<h3>
				You do not have permission to access Refractor. If you think this is an
				error, contact the community's owner.
			</h3>
		</div>

		<div>
			<div>
				<span class="fas fa-lock" />
			</div>
		</div>

		<div />
	</div>
</div>

<style lang="scss">
	@import "../mixins/mixins";

	.wrapper {
		width: 100%;
		height: 100vh;
		max-height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--color-background3),
			var(--color-background2)
		);
	}

	.container {
		background-color: var(--color-background2);
		height: 60rem;
		width: 60rem;
		font-size: 1.4rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		text-align: center;
		padding: 4rem;
		border-radius: var(--border-md);

		@include respond-below(lg) {
			width: 50rem;
			padding: 3rem;
			height: 60rem;
		}

		@include respond-below(sm) {
			width: 100%;
			padding: 6rem 3rem;
			padding-bottom: 10rem;
			height: 100vh;
		}

		h3 {
			margin-top: 6rem;
			font-size: 2rem;
		}

		.fa-lock {
			font-size: 14rem;
			color: var(--color-primary);
		}
	}
</style>
