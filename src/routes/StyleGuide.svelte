<script>
	import Button from "../components/Button.svelte"
	import { currentTheme } from "../theme/store"
</script>

<div class="wrapper">
	<div class="layers">
		<div class="container">
			<h1>Background</h1>
			<div class="outer">
				<h1>Layer 1</h1>
				<div class="inner">
					<Button>Primary</Button>
					<h1>Layer 2</h1>
				</div>
			</div>
		</div>
	</div>

	<div class="flex">
		<div>
			<h1>Colors</h1>
			<div class="colors">
				<div class="col">
					<div id="background1">
						<div>background1</div>
						<div>{$currentTheme.colors.background1}</div>
					</div>
					<div id="background2">
						<div>background2</div>
						<div>{$currentTheme.colors.background2}</div>
					</div>
					<div id="background3">
						<div>background3</div>
						<div>{$currentTheme.colors.background3}</div>
					</div>
				</div>

				<div class="col">
					<div id="primary">
						<div>primary</div>
						<div>{$currentTheme.colors.primary}</div>
					</div>
				</div>

				<div class="col">
					<div id="success">
						<div>success</div>
						<div>{$currentTheme.colors.success}</div>
					</div>
					<div id="warning">
						<div>warning</div>
						<div>{$currentTheme.colors.warning}</div>
					</div>
					<div id="danger">
						<div>danger</div>
						<div>{$currentTheme.colors.danger}</div>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h1>Buttons</h1>
			<div class="buttons">
				<Button>Primary</Button>
				<Button color="success">Success</Button>
				<Button color="warning">Warning</Button>
				<Button color="danger">Danger</Button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		height: 100vh;
		width: 100vw;
		background-color: var(--color-background3);
	}

	.flex {
		padding: 3rem 1rem;
		display: flex;

		> * {
			margin-left: 2rem;
		}
	}

	.layers {
		border-bottom: 2px solid var(--color-background1);

		.container {
			background-color: var(--color-background3);
		}

		.outer {
			margin-top: 2rem;
			background-color: var(--color-background2);
		}

		.inner {
			margin-top: 2rem;
			background-color: var(--color-background1);
		}

		div {
			border-radius: 0.4rem;
			padding: 3rem;
		}
	}

	.colors {
		display: flex;
		padding-top: 2rem;

		> * {
			margin-right: 1.5rem;
		}

		.col {
			display: flex;
			flex-direction: column;

			> * {
				width: 15rem;
				height: 15rem;
				display: grid;
				place-items: center;
				font-size: 1.6rem;
			}
		}

		#background1 {
			background: var(--color-background1);
		}

		#background2 {
			background: var(--color-background2);
		}

		#background3 {
			background: var(--color-background3);
		}

		#primary {
			background: var(--color-primary);
		}

		#success {
			background: var(--color-success);
		}

		#warning {
			background: var(--color-warning);
		}

		#danger {
			background: var(--color-danger);
		}
	}
</style>
