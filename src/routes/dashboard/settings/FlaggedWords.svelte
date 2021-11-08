<script lang="ts">
	import { onMount } from "svelte"

	import { writable } from "svelte/store"

	import Button from "../../../components/Button.svelte"
	import Heading from "../../../components/Heading.svelte"
	import TextInput from "../../../components/TextInput.svelte"
	import {
		createFlaggedWord,
		deleteFlaggedWord,
		getFlaggedWords,
		updateFlaggedWord,
	} from "../../../domain/chat/store"
	import { successToast } from "../../../utils/toast"
	import Container from "../components/Container.svelte"
	import SinglePane from "../components/SinglePane.svelte"

	let words = writable([] as FlaggedWord[])

	onMount(async () => {
		let fetchedWords = await getFlaggedWords()
		fetchedWords = fetchedWords.sort((f1, f2) => {
			// sort words alphabetically
			let word1 = f1.word.toUpperCase()
			let word2 = f2.word.toUpperCase()

			return word1 < word2 ? -1 : word1 > word2 ? 1 : 0
		})

		words.set(fetchedWords)
	})

	function addWord() {
		words.set([...$words, { word: "" }])
	}

	async function deleteWord(idx: number) {
		const word = $words[idx]

		if (!word) {
			return
		}

		if (word.id) {
			await deleteFlaggedWord(word.id)
		}

		words.update((current) => {
			current.splice(idx, 1)
			return current
		})

		successToast("Flagged word deleted")
	}

	async function handleWordChange(idx: number) {
		const word = $words[idx]

		if (!word || word.word.trim().length === 0) {
			return
		}

		// If the word has an ID set, then we update it.
		// If not, then we create it.
		if (!word.id) {
			// create
			const newWord = await createFlaggedWord(word)
			$words[idx] = newWord

			successToast("Flagged word created")
		} else {
			// update
			const updatedWord = await updateFlaggedWord(word.id, word)
			$words[idx] = updatedWord

			successToast("Flagged word updated")
		}
	}
</script>

<svelte:head>
	<title>Refractor - Flagged Word Settings</title>
</svelte:head>

<Container>
	<div class="heading">
		<Heading type="title">Settings: Flagged Words</Heading>
	</div>

	<SinglePane>
		<div class="wrapper">
			<div class="intro">
				Click the Add button to add a new word. Chat messages containing a word
				in this list will be marked as flagged.
			</div>

			<div class="flagged-words">
				{#each $words as word, idx}
					<div class="word">
						<input
							type="text"
							placeholder="Flagged Word"
							bind:value={word.word}
							on:blur={() => handleWordChange(idx)}
						/>
						<button
							class="button button-submit"
							on:click={() => handleWordChange(idx)}
							class:disabled={word.word.trim().length === 0}
						>
							<span class="fas fa-check" />
						</button>

						<button
							class="button button-delete"
							on:click={() => deleteWord(idx)}
						>
							<span class="fas fa-trash-alt" />
						</button>
					</div>
				{/each}
			</div>

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

	.wrapper {
		display: flex;
		flex-direction: column;

		.intro {
			margin-bottom: 2rem;
		}

		.add-btn {
			margin-top: 1rem;
		}
	}

	.flagged-words {
		display: grid;
		flex-direction: column;
		grid-template-columns: 1fr 1fr;
		column-gap: 1rem;
		row-gap: 1rem;

		.word {
			display: flex;
			width: 100%;
			background-color: var(--color-background1);
			border: 1px solid var(--color-accent);
			border-radius: var(--border-sm);

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

			.button {
				display: grid;
				place-items: center;
				width: 4rem;
				height: 100%;
				color: var(--color-text-muted);
				font-size: 1.6rem;
				transition: 0.2s all;
				cursor: pointer;
				background: none;
				border: none;

				&-submit {
					border-left: 1px solid var(--color-accent);

					&:hover {
						background-color: var(--color-success);
						color: var(--color-text1);
					}
				}

				&-delete {
					border-top-right-radius: var(--border-sm);
					border-bottom-right-radius: var(--border-sm);

					&:hover {
						background-color: var(--color-danger);
						color: var(--color-text1);
					}
				}
			}

			.button.disabled {
				cursor: unset;

				&:hover {
					background: none;
					color: var(--color-text-muted);
				}
			}
		}
	}
</style>
