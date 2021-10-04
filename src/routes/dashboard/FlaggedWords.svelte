<script lang="ts">
	import { writable } from "svelte/store"

	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import TextInput from "../../components/TextInput.svelte"
	import type { FlaggedWord } from "../../domain/chat/chat.types"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	let words = writable([] as FlaggedWord[])

	function addWord() {
		words.set([...$words, { word: "" }])
	}

	function deleteWord(idx: number) {
		words.update((current) => {
			current.splice(idx, 1)
			return current
		})
	}
</script>

<Container>
	<div class="heading">
		<Heading type="title">Settings: Flagged Words</Heading>
	</div>

	<SinglePane>
		<div class="flagged-words">
			{#each $words as word, idx}
				<div class="word">
					<input
						type="text"
						placeholder="Flagged Word"
						bind:value={word.word}
					/>
					<div class="button-delete" on:click={() => deleteWord(idx)}>
						<span class="fas fa-trash-alt" />
					</div>
				</div>
			{/each}

			<div class="add-btn">
				<Button on:click={addWord}>Add</Button>
			</div>
		</div>
	</SinglePane>
</Container>

<style lang="scss">
	.heading {
		margin-bottom: 2rem;
	}

	.flagged-words {
		display: flex;
		flex-direction: column;
		width: clamp(40vw, 60vw, 50rem);
		height: clamp(30vh, 50rem, 60vh);

		.word {
			display: flex;
			width: 100%;
			background-color: var(--color-background1);
			border: 1px solid var(--color-accent);
			border-radius: var(--border-sm);
			margin-bottom: 1rem;

			&:first-child {
				border-top: 1px solid var(--color-accent);
			}

			input {
				background: none;
				border: none;
				width: 100%;
				color: var(--color-text2);
				padding: 0.5rem 1rem;
				font-size: 1.6rem;
			}

			.button-delete {
				display: grid;
				place-items: center;
				width: 4rem;
				height: 100%;
				color: var(--color-text-muted);
				font-size: 1.6rem;
				border-top-right-radius: var(--border-sm);
				border-bottom-right-radius: var(--border-sm);
				transition: 0.2s all;
				border-left: 1px solid var(--color-accent);
				cursor: pointer;

				&:hover {
					background-color: var(--color-danger);
					color: var(--color-text1);
				}
			}
		}
	}
</style>
