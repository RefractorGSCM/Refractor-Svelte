<script lang="ts">
	export let duration: number
</script>

<span>
	{#if duration === -1}
		permanent
	{:else}
		{duration} mins
	{/if}
</span>
