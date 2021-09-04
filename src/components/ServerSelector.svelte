<script lang="ts">
	import Select from "./Select.svelte"
	import { createEventDispatcher, onMount } from "svelte"
	import { allServers } from "../domain/server/store"
	import Server from "../routes/dashboard/Server.svelte"
	import { serverPlayers } from "../domain/player/store"

	export let name
	export let error = null
	export let label = name
	export let required = false
	export let value: any = ""

	const dispatch = createEventDispatcher()

	onMount(async () => {
		const initialValue = $allServers[0].id
		value = initialValue
		update({ target: { value: initialValue } })
	})

	function update(e) {
		dispatch("change", parseInt(e.target.value))
	}
</script>

<div class="input-wrapper">
	<div class="input-main" class:error={!!error}>
		<select
			class="select"
			id="sel-i-{name}"
			{name}
			{required}
			{value}
			on:blur={update}
			on:change={update}
		>
			{#each $allServers as server}
				<option value={server.id}>{server.name}</option>
			{/each}
		</select>

		<div class="underline" />
		<label for="sel-i-{name}">{label}</label>
	</div>

	<div class="error-text">{error ? error : ""}</div>
</div>

<style lang="scss">
	.input-wrapper {
		height: 6rem;

		.input-main {
			margin-top: 1rem;
			height: 3rem;
			width: 100%;
			position: relative;

			select {
				height: 100%;
				width: 100%;
				border: none;
				background: none;
				border-bottom: 2px solid var(--color-primary);
				line-height: 2rem;
				font-size: 1.7rem;
				outline: none;
				color: var(--color-text2);
			}

			select:focus ~ label,
			select:valid ~ label {
				transform: translateY(-1.8rem);
				font-size: 1.2rem;
				color: var(--color-primary-light);
			}

			label {
				position: absolute;
				bottom: 1rem;
				left: 0;
				font-size: 1.5rem;
				color: var(--color-text-muted);
				pointer-events: none;
				transition: all 0.3s ease;
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
				transform: scaleX(0);
				transform-origin: center;
				transition: transform 0.3s ease;
			}

			select:focus ~ .underline::before,
			select:valid ~ .underline::before {
				transform: scaleX(1);
			}

			&.error {
				select {
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
