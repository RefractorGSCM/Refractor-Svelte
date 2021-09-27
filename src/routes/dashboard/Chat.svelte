<script lang="ts">
	import { onMount } from "svelte"
	import {
		afterUpdate,
		beforeUpdate,
		missing_component,
		tick,
	} from "svelte/internal"
	import { writable } from "svelte/store"
	import Heading from "../../components/Heading.svelte"
	import Spinner from "../../components/Spinner.svelte"
	import { chatMessages } from "../../domain/chat/store"
	import { loading, setLoading } from "../../domain/loading/store"
	import type { Server } from "../../domain/server/server.types"
	import {
		allServers,
		getAllServers,
		getServerPermissions,
	} from "../../domain/server/store"
	import {
		checkFlag,
		FLAG_READ_LIVE_CHAT,
		FLAG_VIEW_SERVERS,
		getFlag,
	} from "../../permissions/permissions"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"

	export let id
	let server: Server = null
	let errmsg = writable(null as string)
	let permissions = writable(null as BigInt)

	let messageBoxRef = null

	onMount(async () => {
		setLoading("chat", true)

		try {
			id = parseInt(id)
		} catch (err) {
			errmsg.set("Server not found")
			setLoading("chat", false)
			return
		}

		if ($allServers.length === 0) {
			await getAllServers()
		}

		let found = false
		for (const s of $allServers) {
			if (s.id === id) {
				found = true
				server = s
				break
			}
		}

		if (!found) {
			errmsg.set("Server not found")
			setLoading("chat", false)
			return
		}

		// Get computed user permissions scoped to this server
		const perms = await getServerPermissions(server.id)
		permissions.set(perms)

		if (!checkFlag(perms, getFlag(FLAG_READ_LIVE_CHAT))) {
			errmsg.set("Server not found")
			setLoading("chat", false)
			return
		}

		if (!$chatMessages[server.id]) {
			chatMessages.set({
				...$chatMessages,
				[server.id]: [],
			})
		}

		setLoading("chat", false)

		setTimeout(scrollToBottom, 100)
	})

	let preScrollDone = false
	afterUpdate(() => {
		if (messageBoxRef && !preScrollDone) {
			scrollToBottom()
			preScrollDone = true
		}
	})

	function scrollToBottom() {
		messageBoxRef.scrollTo({
			top: messageBoxRef.scrollHeight - messageBoxRef.clientHeight,
			behavior: "smooth",
		})
	}
</script>

<Container>
	{#if $loading["chat"]}
		<Spinner blocking />
	{:else if !!$errmsg}
		<Heading type="title">{$errmsg}</Heading>
	{:else if !!server}
		<SinglePane>
			<div class="heading">
				<Heading type="title">{server.name} - Chat</Heading>
			</div>
		</SinglePane>

		<div class="chat-window">
			<div class="wrapper" bind:this={messageBoxRef}>
				<div class="content">
					{#each $chatMessages[server.id] as msg}
						<div class="message">
							<span class="name">{msg.name}</span>
							{msg.message}
						</div>
					{/each}
				</div>
			</div>
			<input
				type="text"
				class="chatbox"
				placeholder="Enter a message and hit enter"
			/>
			<div class="legend">
				<div>= you</div>
				<div>= other users</div>
			</div>
		</div>
	{/if}
</Container>

<style lang="scss">
	.chat-window {
		height: clamp(25vh, 60vh, 70vh);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: var(--border-md);
		background-color: var(--color-background2);

		.wrapper {
			overflow-y: scroll;
			position: relative;
			border-radius: var(--border-md);
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;

			// Chrome, Safari, Opera
			::-webkit-scrollbar {
				display: none;
			}
			-ms-overflow-style: none; // Edge
			scrollbar-width: none; // Firefox

			.content {
				display: flex;
				flex-direction: column;
				overflow-y: scroll;
				font-size: 1.6rem;
				position: relative;

				// Chrome, Safari, Opera
				::-webkit-scrollbar {
					display: none;
				}
				-ms-overflow-style: none; // Edge
				scrollbar-width: none; // Firefox

				> :nth-child(even) {
					background-color: var(--color-background1);
				}
				> :nth-child(odd) {
					background-color: var(--color-background2);
				}

				.message {
					width: 100%;
					display: flex;
					flex-direction: row;
					padding: 0.4rem 1rem;

					span.name {
						color: var(--color-text2);
						width: 100%;
						font-weight: 500;
						margin-right: 1rem;
						width: 15%;
						max-width: 10vw;
					}
				}
			}
		}

		.chatbox {
			height: 4rem;
			border: 0;
			font-size: 1.6rem;
			color: var(--color-primary-light);
			padding: 2rem 1rem;
			background-color: var(--color-background3);
			outline: none;
			border-left: 2px solid var(--color-background2);
			border-right: 2px solid var(--color-background2);
		}

		.legend {
			display: flex;
			font-size: 1.6rem;
			line-height: 1.6rem;
			padding: 1rem;

			> * {
				padding-left: 0.5rem;
				margin-right: 2rem;
			}

			> :nth-child(1) {
				border-left: 1.6rem solid var(--color-primary);
			}

			> :nth-child(2) {
				border-left: 1.6rem solid var(--color-danger);
			}
		}

		.scroll-down-btn {
			position: sticky;
			bottom: 0;
			width: 80%;
			margin-left: 10%;
			margin-right: 10%;
			height: 2rem;
			text-align: center;
			border-top-left-radius: 1rem;
			border-top-right-radius: 1rem;
			background-color: var(--color-accent);
			font-size: 1.2rem;
			user-select: none;

			width: 30%;
			margin-left: 35%;
			margin-right: 35%;

			> :hover {
				cursor: pointer;
			}
		}
	}
</style>
