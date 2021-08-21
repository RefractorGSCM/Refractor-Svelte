<script lang="ts">
	import { onMount } from "svelte"
	import { Route, Router } from "svelte-routing"
	import Heading from "../../components/Heading.svelte"
	import type { Server } from "../../domain/server/server.types"
	import {
		allServers,
		getAllServers,
		getServerById,
	} from "../../domain/server/store"
	import Container from "./components/Container.svelte"
	import SinglePane from "./components/SinglePane.svelte"
	import ServerGroups from "./ServerGroups.svelte"

	export let id
	let server: Server = null
	let errmsg: string

	onMount(async () => {
		try {
			id = parseInt(id)
		} catch (e) {
			errmsg = "Server not found"
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
			}
		}

		if (!found) {
			errmsg = "Server not found"
		}
	})
</script>

<Container>
	{#if server === null}
		<Heading type="title">{errmsg}</Heading>
	{:else}
		<SinglePane>
			<div class="heading">
				<Heading type="subtitle">{server.name}</Heading>

				<div class="status">
					<div class="status__item hm">
						<span>Players:</span>10
					</div>
					<div class="status__item">
						<span>Status:</span>Online
					</div>
					<div class="status__item hm">
						<span>Address:</span>127.0.0.1
					</div>
				</div>
			</div>
		</SinglePane>
	{/if}
</Container>

<style lang="scss">
	@import "../../mixins/mixins";

	.heading {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 8rem;

		.status {
			display: flex;

			> * {
				margin-right: 2rem;

				&:last-child {
					margin-right: 0;
				}
			}

			&__item {
				font-size: 1.6rem;

				span {
					color: var(--color-primary-light);
					margin-right: 0.4rem;
				}
			}

			@include respond-below(xs) {
				.hm {
					display: none;
				}
			}
		}
	}
</style>
