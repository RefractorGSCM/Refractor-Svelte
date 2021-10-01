<script context="module">
	// Since we don't have fine grained control over the date picker styling, we run into issues with
	// z-index. We need to set the deselect button to have a higher z-index than the date picker for it
	// to be clickable, but we can't dynamically adjust the date picker calendar display's z-index so we
	// run into an issue where the deselect button shows over the calendar.
	//
	// hideDeselectBtn is used to conditionally assign a class
	let hideDeselectBtn = writable(false)
</script>

<script>
	import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte"
	import { CalendarStyle } from "@beyonk/svelte-datepicker/src/calendar-style.js"
	import { stringify } from "query-string"
	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	export let name
	export let value
	export let label = name
	export let error = ""
	export let defaultText = "Select"

	const styling = new CalendarStyle({
		buttonBackgroundColor: "none",
		buttonBorderColor: "none",
		buttonTextColor: "rgba(0, 0, 0, 0)",
		buttonHeight: "3rem",
		buttonWidth: "100%",
		highlightColor: "var(--color-primary)",
		contentBackground: "var(--color-background1)",
		dayTextColor: "var(--color-text2)",
		dayTextColorIsNight: "var(--color-text2)",
		dayTextColorInRange: "var(--color-text2)",
		currentDayTextColor: "var(--color-text2)",
		selectedDayTextColor: "var(--color-text2)",
		timeNightModeTextColor: "var(--color-text2)",
		timeDayModeTextColor: "var(--color-text2)",
		timeSelectedTextColor: "var(--color-text2)",
		timeInputTextColor: "var(--color-text2)",
		timeNightModeBackgroundColor: "var(--color-background1)",
		timeDayModeBackgroundColor: "var(--color-background1)",
		monthYearTextColor: "var(--color-text2)",
		legendTextColor: "var(--color-text-muted)",
		timeConfirmButtonColor: "var(--color-primary)",
		timeConfirmButtonTextColor: "var(--color-text1)",
	})

	const dispatch = createEventDispatcher()

	function onChange(date) {
		value = date.date
		dispatch("select", date.date)
	}
</script>

<div class="datepicker-wrapper">
	<div class="main">
		<div class="date">
			<span
				>{!!value
					? value.toLocaleString("en-GB", { hour12: true }).replace(",", "")
					: defaultText}
			</span>

			{#if !!value}
				<div
					class="deselect-button"
					class:reset-z={$hideDeselectBtn}
					on:click={(e) => {
						e.stopPropagation()
						onChange({ date: null })
					}}
				>
					&#10005;
				</div>
			{/if}
		</div>

		<div class="picker">
			<DatePicker
				{styling}
				time
				on:open={() => {
					hideDeselectBtn.set(true)
				}}
				on:close={() => {
					hideDeselectBtn.set(false)
				}}
				on:date-selected={(e) => onChange(e.detail)}
				selected={false}
			/>
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

				span {
					position: absolute;
					bottom: calc(50% - 1rem);
				}

				.deselect-button {
					position: absolute;
					top: calc(50% - 1rem);
					right: 0.5rem;
					font-size: 1.4rem;
					height: 2rem;
					width: 2rem;
					background-color: var(--color-accent);
					border-radius: var(--border-sm);
					display: grid;
					place-items: center;
					cursor: pointer;
					z-index: 1001;
				}

				.deselect-button.reset-z {
					z-index: unset;
				}
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

				:global(.contents-wrapper) {
					position: fixed;
					z-index: 2000 !important;
					background-color: var(--color-background1);
				}

				:global(.contents-wrapper *) {
					z-index: 2000 !important;
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
