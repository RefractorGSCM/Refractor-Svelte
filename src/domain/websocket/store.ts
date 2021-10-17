import { toast } from "@zerodevx/svelte-toast"
import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import { getSelfInfo } from "../auth/store"
import { addChatMessage } from "../chat/store"
import { addPlayerToServer, removePlayerFromServer } from "../player/store"
import { setServerStatus } from "../server/store"
import ReconnectingWebSocket from "reconnecting-websocket"

const messageStore = writable("")

let socket: ReconnectingWebSocket = null
let connectionLostToastID

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
}

export function getCurrentWebsocket() {
	return socket
}
