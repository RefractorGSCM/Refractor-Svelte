import { toast } from "@zerodevx/svelte-toast"
import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import { addChatMessage } from "../chat/store"
import { addPlayerToServer, removePlayerFromServer } from "../player/store"
import { setServerStatus } from "../server/store"

const messageStore = writable("")

let socket: WebSocket = null
let pingInterval

let reconnectInterval
let tryingToReconnect = false
let reconnectToastIds: number[] = []

export function openWebsocketConnection() {
	socket = new WebSocket(`${WS_ROOT}`)

	socket.addEventListener("open", () => {
		if (tryingToReconnect) {
			// if this connection was initialized by the reconnect routine then cleanup the
			// reconnect routine.

			clearInterval(reconnectInterval)
			tryingToReconnect = false
			for (const toastId of reconnectToastIds) {
				toast.pop(toastId)
			}
			reconnectToastIds = []

			successToast("Websocket reconnected")
		}

		console.log("Websocket connection established")
	})

	socket.addEventListener("close", (info) => {
		console.log("Websocket connection closed")
		clearInterval(pingInterval)

		console.log(info) // code 1006?

		if (info.wasClean || tryingToReconnect) {
			// if the disconnect was clean, this was done intentionally.
			return
		}
		tryingToReconnect = true

		const options = {
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

		reconnectToastIds.push(
			toast.push(
				"Refractor may not behave properly while the websocket is disconnected.",
				options,
			),
		)

		reconnectToastIds.push(
			toast.push(
				"Websocket connection closed. Attempting to reconnect...",
				options,
			),
		)

		reconnectInterval = setInterval(() => {
			if (!tryingToReconnect) {
				// if tryingToReconnect is false, then reconnection was succesful so this interval should stop running
				return
			}

			openWebsocketConnection()
		}, 2000)
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
		}
	})

	// ping the server every 2 minutes to ensure the socket stays alive
	pingInterval = setInterval(() => {
		if (socket.readyState <= 1) {
			socket.send(
				JSON.stringify({
					type: "ping",
				}),
			)
		}
	}, 120000)
}

export function getCurrentWebsocket() {
	return socket
}
