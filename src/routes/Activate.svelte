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
			<Heading type="title">EMAIL VERIFICATION</Heading>

			<h3>
				You must validate your email address before accessing Refractor. Please
				check your inbox for instructions.
			</h3>
		</div>

		<div>
			<span class="far fa-envelope" />
		</div>

		<div class="resend-notice">
			If you didn't receive a verification email, please make sure that you're
			using the correct email and check your spam folder. If you still don't
			have a verification email, <a href={`${AUTH_ROOT}/k/verify`}>click here</a
			> to receive a new one.
		</div>
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

		.resend-notice {
			font-size: 1.6rem;
			color: var(--color-text2);

			a {
				color: var(--color-primary);
				text-decoration: underline;

				&:hover {
					color: var(--color-primary-light);
					border-bottom: 1px solid var(--color-primary-light);
				}
			}
		}

		.fa-envelope {
			font-size: 14rem;
			color: var(--color-primary);
		}
	}
</style>
