<script lang="ts">
	import { onMount } from "svelte"
	import { group_outros, time_ranges_to_array } from "svelte/internal"
	import Button from "../../components/Button.svelte"

	import Heading from "../../components/Heading.svelte"
	import Spinner from "../../components/Spinner.svelte"
	import { allGroups, getAllGroups } from "../../domain/group/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import Container from "./components/Container.svelte"

	onMount(async () => {
		setLoading("groups", true)

		await getAllGroups()

		setLoading("groups", false)
	})
</script>

{#if $loading["groups"]}
	<Spinner blocking={true} />
{/if}

<Heading type="title">Groups</Heading>

<div class="container">
	<div class="groups-list">
		{#each $allGroups as group}
			<div class="group" style={`color: #${group.color.toString(16)}`}>
				{group.name}
			</div>
		{/each}
	</div>

	<div class="manager">
		<div class="editor">
			<Heading>Managing: Group 1</Heading>
		</div>
		<div class="buttons">
			<Button color="danger">Reset</Button>
			<Button>Save</Button>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin-top: 2rem;
		display: grid;
		grid-template-columns: 1fr 3fr;
		grid-column-gap: 2rem;
		font-size: 1.6rem;
		min-height: 30rem;

		> * {
			padding: 2rem;
			background-color: var(--color-background2);
			border-radius: var(--border-md);
		}
	}

	.groups-list {
		.group {
			padding: 0.8rem;
			border-radius: var(--border-sm);
			user-select: none;

			&:hover {
				background-color: var(--color-background1);
				cursor: pointer;
			}
		}
	}

	.manager {
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.editor {
			flex: 1;
		}

		.buttons {
			margin-left: auto;
		}
	}
</style>
