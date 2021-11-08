<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import { getUserPrimaryGroup } from "../domain/group/store"
	import { decimalToHex, hexToDecimal } from "../utils/color"

	export let userId

	let group = writable(null as Group)
	onMount(async () => {
		if (userId) {
			group.set(await getUserPrimaryGroup(userId))
		} else {
			group.set({
				id: -2,
				color: hexToDecimal("424242"),
				name: "",
				permissions: BigInt(0),
				position: -1,
			})
		}
	})
</script>

{#if !$group}
	<span>Loading...</span>
{:else}
	<span
		class="username-display"
		style={`color: #${decimalToHex($group.color)}`}
	>
		<slot />
	</span>
{/if}
