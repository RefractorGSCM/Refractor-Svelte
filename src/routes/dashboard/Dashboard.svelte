<script lang="ts">
	import { onMount } from "svelte"
	import { Link, Route, Router } from "svelte-routing"
	import Button from "../../components/Button.svelte"
	import Heading from "../../components/Heading.svelte"
	import NameDisplay from "../../components/NameDisplay.svelte"
	import RequirePerms from "../../components/RequirePerms.svelte"
	import { self } from "../../domain/auth/store"
	import { getAllGames } from "../../domain/game/store"
	import { getAllServers } from "../../domain/server/store"
	import {
		FLAG_ADMINISTRATOR,
		FLAG_MODERATE_FLAGGED_MESSAGES,
		FLAG_VIEW_CHAT_RECORDS,
		FLAG_VIEW_INFRACTION_RECORDS,
		FLAG_VIEW_PLAYER_RECORDS,
		FLAG_VIEW_SERVERS,
	} from "../../permissions/permissions"
	import Chat from "./Chat.svelte"
	import ChatRecords from "./ChatRecords.svelte"
	import Container from "./components/Container.svelte"
	import Infraction from "./Infraction.svelte"
	import InfractionRecords from "./InfractionRecords.svelte"
	import MessageModeration from "./MessageModeration.svelte"
	import Player from "./Player.svelte"
	import PlayerRecords from "./PlayerRecords.svelte"
	import Server from "./Server.svelte"
	import ServerGroups from "./ServerGroups.svelte"
	import Servers from "./Servers.svelte"
	import Settings from "./settings/Settings.svelte"
	import Stats from "./Stats.svelte"

	onMount(async () => {
		await getAllGames()
		await getAllServers()
	})

	function logout() {
		window.location.replace(
			`${import.meta.env.VITE_KRATOS_ROOT}/self-service/browser/flows/logout`,
		)
	}

	let showAvatarMenu = false

	export let url = ""
</script>

<svelte:head>
	<title>Refractor - Dashboard</title>
</svelte:head>

<input type="checkbox" id="sidebar-toggle" />
<nav class="sidebar">
	<div class="header">
		<h3 class="brand"><span class="fab fa-replyd" />fractor</h3>
		<label for="sidebar-toggle" class="fas fa-bars" />
	</div>

	<div class="menu">
		<ul>
			<div class="link">
				<Link to="/">
					<li>
						<span class="fas fa-home" />
						<span>Dashboard</span>
					</li>
				</Link>
			</div>

			<RequirePerms allOf={[FLAG_VIEW_SERVERS]}>
				<div class="link">
					<Link to="/servers">
						<li>
							<span class="fas fa-server" />
							<span>Servers</span>
						</li>
					</Link>
				</div>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_PLAYER_RECORDS]}>
				<div class="link">
					<Link to="/records/players">
						<li>
							<span class="fas fa-user" />
							<span>Players</span>
						</li>
					</Link>
				</div>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_INFRACTION_RECORDS]}>
				<div class="link">
					<Link to="/records/infractions">
						<li>
							<span class="fas fa-list" />
							<span>Infractions</span>
						</li>
					</Link>
				</div>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_CHAT_RECORDS]}>
				<div class="link">
					<Link to="/records/chat">
						<li>
							<span class="fas fa-comments" />
							<span>Chat Logs</span>
						</li>
					</Link>
				</div>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_MODERATE_FLAGGED_MESSAGES]}>
				<div class="link">
					<Link to="/chat/moderation">
						<li>
							<span class="fas fa-bullhorn" />
							<span>Flagged Messages</span>
						</li>
					</Link>
				</div></RequirePerms
			>

			<div class="bottom">
				<RequirePerms allOf={[FLAG_ADMINISTRATOR]}>
					<div class="link">
						<Link to="/settings">
							<li>
								<span class="fas fa-cog" />
								<span>Admin Settings</span>
							</li>
						</Link>
					</div>
				</RequirePerms>

				<div class="link">
					<a href={`${import.meta.env.VITE_AUTH_ROOT}/settings`}>
						<li>
							<span class="fas fa-user-circle" />
							<span>Account</span>
						</li>
					</a>
				</div>
			</div>
		</ul>
	</div>
</nav>

<div class="content">
	<header>
		<div class="brand-name">{import.meta.env.VITE_COMMUNITY_NAME}</div>

		<div class="right">
			<div><NameDisplay userId={$self.id}>{$self.username}</NameDisplay></div>

			<Button size="inline" on:click={() => logout()}>Log out</Button>
		</div>
	</header>

	<main>
		<Router {url}>
			<RequirePerms allOf={[FLAG_ADMINISTRATOR]}>
				<Route path="/settings/*" component={Settings} />
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_SERVERS]}>
				<Route path="/servers" component={Servers} />
				<Route path="/server/:id" let:params>
					<Server id={params.id} />
				</Route>
				<Route path="/server/:id/groups" let:params>
					<ServerGroups id={params.id} />
				</Route>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_PLAYER_RECORDS]}>
				<Route path="/player/:platform/:id" let:params>
					<Player platform={params.platform} id={params.id} />
				</Route>
			</RequirePerms>

			<Route path="/server/:id/chat" let:params>
				<Chat id={params.id} />
			</Route>

			<RequirePerms
				oneOf={[FLAG_VIEW_PLAYER_RECORDS, FLAG_VIEW_INFRACTION_RECORDS]}
			>
				<Route path="/infraction/:id" let:params>
					<Infraction id={params.id} />
				</Route>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_PLAYER_RECORDS]}>
				<Route path="/records/players">
					<PlayerRecords />
				</Route>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_INFRACTION_RECORDS]}>
				<Route path="/records/infractions">
					<InfractionRecords />
				</Route>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_VIEW_CHAT_RECORDS]}>
				<Route path="/records/chat">
					<ChatRecords />
				</Route>
			</RequirePerms>

			<RequirePerms allOf={[FLAG_ADMINISTRATOR]}>
				<Route path="/settings">
					<Settings />
				</Route>
			</RequirePerms>

			<Route path="/chat/moderation">
				<MessageModeration />
			</Route>

			<Route path="/" component={Stats} />

			<Route>
				<Container>
					<Heading type="title">404: Page not found</Heading>
				</Container>
			</Route>
		</Router>
	</main>
</div>

<style lang="scss">
	@import "../../mixins/mixins.scss";

	#sidebar-toggle {
		display: none;
	}

	// Sidebar collapse
	#sidebar-toggle:checked {
		& ~ .sidebar {
			max-width: 8rem;

			@include respond-below(xl) {
				max-width: 6rem;
			}

			.header {
				display: flex;
				justify-content: center;

				.brand {
					display: none;
				}
			}

			h3 span:last-child {
				display: none; // hide brand name
			}

			li {
				padding: 1rem;
				text-align: center;

				span:last-child {
					display: none;
				}
			}
		}

		& ~ .content {
			margin-left: 8rem;

			header {
				left: 8rem;
				width: calc(100% - 8rem);
			}

			:global(.bottom-bar) {
				left: 8rem;
				width: calc(100% - 8rem);
			}

			@include respond-below(xl) {
				margin-left: 6rem;

				header {
					left: 6rem;
					width: calc(100% - 6rem);
				}
			}
		}
	}

	// Sidebar styling
	nav.sidebar {
		height: 100%;
		max-width: 26rem;
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
		background: var(--color-accent);
		color: var(--color-text2);
		font-size: 1.8rem;
		overflow-y: auto;
		transition: max-width 0.1s;
		user-select: none;

		@include respond-below(xl) {
			font-size: 1.6rem;
			max-width: 24rem;
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 8rem;
			padding: 1rem 2rem;

			h3 {
				padding-left: 1rem;
				cursor: pointer;
				font-size: 1.6rem;

				span {
					font-size: 2.7rem;
				}
			}

			label {
				cursor: pointer;
			}
		}

		.menu {
			padding: 0 1rem;
		}

		li {
			padding: 1rem 2rem;
			border-radius: 6px;

			span:last-child {
				transition: opacity 0.5s;
				opacity: 1;
			}

			&:hover {
				cursor: pointer;
				background: var(--color-accent-light);
			}
		}

		a {
			color: var(--color-text2);
			text-decoration: none;

			span:first-child {
				width: 2rem;
			}

			span:last-child {
				padding-left: 1rem;
			}
		}

		.bottom {
			position: absolute;
			bottom: 1rem;
			width: calc(100% - 2rem);
		}
	}

	.content {
		position: relative;
		margin-left: 26rem; // move past sidebar
		transition: margin-left 0.1s;

		@include respond-below(xl) {
			margin-left: 24rem;
		}

		header {
			position: fixed;
			top: 0;
			left: 26rem;
			z-index: 100;
			width: calc(100% - 26rem);
			background: var(--color-topbar);
			height: 8rem;
			padding: 0 3rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			transition: all 0.1s;
			user-select: none;

			.right {
				display: flex;
				align-items: center;

				div {
					margin-right: 2rem;
					font-size: 1.4rem;
				}
			}

			@include respond-below(xl) {
				height: 6rem;
				left: 24rem;
				width: calc(100% - 24rem);
			}

			.brand-name {
				font-size: 2rem;
				font-weight: 400;
				display: flex;

				div {
					margin-right: 1rem;
				}

				@include respond-below(sm) {
					font-size: 1.6rem;
				}
			}
		}

		main {
			margin-top: 8rem;
			background: var(--color-background3);
			min-height: calc(100vh - 8rem);
			width: 100%;
			position: relative;

			@include respond-below(xl) {
				margin-top: 6rem;
				min-height: calc(100vh - 6rem);
			}
		}

		:global(.bottom-bar) {
			width: calc(100% - 26rem);
			left: 26rem;

			@include respond-below(xl) {
				left: 24rem;
				width: calc(100% - 24rem);
			}
		}
	}

	@include respond-below(lg) {
		// Start with the sidebar collapsed on smaller screens
		nav.sidebar {
			font-size: 1.6rem;
			max-width: 6rem;

			.header {
				display: flex;
				justify-content: center;

				.brand {
					display: none;
				}
			}

			h3 span:last-child {
				display: none; // hide brand name
			}

			li {
				padding: 1rem;
				text-align: center;

				span:last-child {
					display: none;
				}
			}
		}

		.content {
			margin-left: 6rem;

			header {
				left: 6rem;
				width: calc(100% - 6rem);
			}

			:global(.bottom-bar) {
				left: 6rem;
				width: calc(100% - 6rem);
			}
		}

		// Expand if the checkbox was checked
		#sidebar-toggle:checked {
			& ~ .sidebar {
				max-width: 24rem;

				.header {
					// display: inline;
					justify-content: space-between;

					.brand {
						display: unset;
					}
				}

				h3 span:last-child {
					display: inline; // hide brand name
				}

				li {
					text-align: unset;
					padding-left: 2rem;
				}

				li span:last-child {
					display: inline; // hide nav tag label
				}
			}

			& ~ .content {
				margin-left: 24rem;

				header {
					left: 24rem;
					width: calc(100% - 24rem);
				}

				:global(.bottom-bar) {
					left: 24rem;
					width: calc(100% - 24rem);
				}
			}
		}
	}

	@include respond-below(md) {
		nav.sidebar {
		}

		#sidebar-toggle:checked {
			& ~ .content {
				margin-left: 6rem;
				margin-top: 6rem;
				z-index: -100;

				main {
					z-index: -100;
				}

				header {
					z-index: -100;
					left: 6rem;
					width: calc(100% - 6rem);
				}

				:global(.bottom-bar) {
					z-index: 1;
					// left: 4rem;
					width: calc(100% - 4rem);
				}
			}
		}
	}

	// Link styling override
	.link > :global(a) {
		text-decoration: none;
		color: var(--color-text2);
	}

	// Spinner position fix
	:global(main .spinner) {
		top: 0;
		left: 0;
	}
</style>
