import { writable } from "svelte/store"

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

		console.log("Received message:", msg)
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
