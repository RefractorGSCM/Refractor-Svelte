import { writable } from "svelte/store"
import { addChatMessage } from "../chat/store"
import { addPlayerToServer, removePlayerFromServer } from "../player/store"
import { setServerStatus } from "../server/store"

const messageStore = writable("")

let socket: WebSocket = null
let pingInterval

export function openWebsocketConnection() {
	socket = new WebSocket(`${WS_ROOT}`)

	socket.addEventListener("open", () => {
		console.log("Websocket connection established")
	})

	socket.addEventListener("close", () => {
		console.log("Websocket connection closed")
		clearInterval(pingInterval)
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
