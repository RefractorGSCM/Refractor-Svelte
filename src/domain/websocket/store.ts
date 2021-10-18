import { toast } from "@zerodevx/svelte-toast"
import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import { getSelfInfo } from "../auth/store"
import { addChatMessage } from "../chat/store"
import {
	addPlayerToServer,
	removePlayerFromServer,
	setServerPlayers,
} from "../player/store"
import { setServerStatus } from "../server/store"
import ReconnectingWebSocket from "reconnecting-websocket"

const messageStore = writable("")

let socket: ReconnectingWebSocket = null
let connectionLostToastID
let pingInterval

const toastOptions = {
	theme: {
		"--toastBackground": "var(--color-danger)",
	},
	duration: 99999999,
	dismissable: false,
	progress: 0,
	initial: -1000000,
	reversed: undefined,
	intro: undefined,
}

let reconnecting = false
export function connectWebsocket() {
	if (socket && socket.readyState === 1) {
		// if the socket is already connected, ignore duplicate call
		console.log("Ignoring duplicate connectWebsocket call")
		return
	}

	socket = new ReconnectingWebSocket(`${import.meta.env.VITE_WS_ROOT}`, [], {
		minReconnectionDelay: 1000,
		maxReconnectionDelay: 10000,
	})

	socket.addEventListener("open", () => {
		console.log("Websocket connection opened")

		toast.pop(connectionLostToastID)

		if (reconnecting) {
			successToast("Websocket reconnected")
			reconnecting = false
		}

		pingInterval = setInterval(() => {
			socket.send(JSON.stringify({ type: "ping", body: null }))
		}, 30000)
	})

	socket.addEventListener("error", () => {})

	socket.addEventListener("close", () => {
		console.log("Websocket connection closed")

		if (!reconnecting) {
			reconnecting = true

			connectionLostToastID = toast.push(
				`Websocket connection lost. Attempting to reconnect...`,
				toastOptions,
			)
		}
	})

	socket.addEventListener("message", (wsmsg) => {
		const msg = JSON.parse(wsmsg.data)
		const { type, body } = msg

		console.log("Received message:", msg)

		switch (type) {
			case "player-join": {
				addPlayerToServer(body.serverId, {
					id: body.id,
					platform: body.platform,
					name: body.name,
					watched: body.watched,
					infraction_count: body.infraction_count,
				})
				break
			}

			case "player-quit": {
				removePlayerFromServer(body.serverId, body.id)
				break
			}

			case "server-status": {
				setServerStatus(body.server_id, body.status)
				break
			}

			case "chat": {
				addChatMessage(body.server_id, body)
				break
			}

			case "player-list-refresh": {
				setServerPlayers(body.server_id, body.online_players)
				break
			}
		}
	})
}

export function getCurrentWebsocket() {
	return socket
}
