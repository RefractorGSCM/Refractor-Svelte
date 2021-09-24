<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import type { Group } from "../domain/group/group.types"
	import { getUserPrimaryGroup } from "../domain/group/store"
	import { decimalToHex } from "../utils/color"
	import Spinner from "./Spinner.svelte"

	export let userId

	let group = writable(null as Group)
	onMount(async () => {
		group.set(await getUserPrimaryGroup(userId))
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
