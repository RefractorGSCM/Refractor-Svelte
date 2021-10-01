<script>
	import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte"
	import { CalendarStyle } from "@beyonk/svelte-datepicker/src/calendar-style.js"
	import { stringify } from "query-string"

	export let name
	export let value
	export let label = name
	export let error = ""
	export let disabled = false

	const styling = new CalendarStyle({
		buttonBackgroundColor: "none",
		buttonBorderColor: "none",
		buttonTextColor: "rgba(0, 0, 0, 0)",
		buttonHeight: "3rem",
		buttonWidth: "100%",
	})

	$: console.log(value, typeof value)
</script>

<div class="style-wrapper" />

<div class="datepicker-wrapper">
	<div class="main">
		<div class="date">
			{value?.date.toLocaleString("en-GB", { hour12: true }).replace(",", "")}
		</div>

		<div class="picker">
			<DatePicker {styling} time on:date-selected={(e) => (value = e.detail)} />
		</div>

		<div class="underline" />
		<label for="dp-i-{name}">{label}</label>
	</div>

	<div class="error-text">{error ? error : ""}</div>
</div>

<style lang="scss">
	.datepicker-wrapper {
		height: 6rem;

		.main {
			margin-top: 1rem;
			height: 3rem;
			width: 100%;
			position: relative;

			.date {
				position: relative;
				height: 100%;
				width: 100%;
				border: none;
				background: none;
				border-bottom: 2px solid var(--color-primary);
				line-height: 2rem;
				font-size: 1.7rem;
				outline: none;
				color: var(--color-text2);
				user-select: none;
				cursor: pointer;
			}

			.picker {
				height: 100%;
				width: 100%;
				position: absolute;
				z-index: 1000;
				top: 0;

				:global(.calendar-button) {
					height: 3rem;
					width: 100%;
					border-radius: 0;
				}

				:global(.datepicker) {
					width: 100%;
				}
			}

			span {
				position: absolute;
				bottom: calc(50% - 1rem);
			}

			label {
				position: absolute;
				bottom: 1rem;
				left: 0;
				color: var(--color-text-muted);
				pointer-events: none;
				transition: all 0.3s ease;
				transform: translateY(-1.8rem);
				font-size: 1.2rem;
				color: var(--color-primary-light);
			}

			.underline {
				position: absolute;
				bottom: 0;
				height: 2px;
				width: 100%;
			}

			.underline::before {
				position: absolute;
				content: "";
				width: 100%;
				height: 100%;
				background: var(--color-primary-light);
				transform-origin: center;
				transition: transform 0.3s ease;
			}

			&.error {
				.date {
					border-bottom: 2px solid var(--color-danger);
				}

				label {
					color: var(--color-text-muted) !important;
				}

				.underline::before {
					background: var(--color-danger);
				}
			}
		}

		.error-text {
			height: 2rem;
			color: var(--color-danger);
			font-size: 1.2rem;
			padding-top: 0.5rem;
		}
	}
</style>
