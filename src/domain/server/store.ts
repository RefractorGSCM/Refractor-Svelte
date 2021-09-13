import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import { addPlayerToServer } from "../player/store"
import api from "./api"
import type {
	CreateServerParams,
	Server,
	UpdateServerParams,
} from "./server.types"

export const allServers = writable([] as Server[])
export const fragmentServers = writable([] as Server[])

export async function getAllServers() {
	try {
		const { data } = await api.getServers()
		const { payload } = data

		if (Array.isArray(payload)) {
			allServers.set(payload.filter((s) => !s.is_fragment))

			for (const server of payload) {
				if (server.is_fragment) {
					fragmentServers.update((current) => {
						current.push(server)
						return current
					})
					continue
				}

				if (server.online_players && server.online_players.length > 0) {
					// If there are online players, add them all in the player store
					for (const player of server.online_players) {
						console.log("pl", player)
						addPlayerToServer(server.id, player)
					}
				}
			}
		} else {
			allServers.set([])
		}
	} catch (err) {
		errorToast("Could not get servers")
	}
}

export async function createServer(newServer: CreateServerParams) {
	try {
		const { data } = await api.createServer(newServer)

		console.log(data)

		successToast("Server created")
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				...data.errors,
			}
		}

		errorToast("Could not create server")
	}
}

export async function updateServer(
	id: number,
	args: UpdateServerParams,
): Promise<UpdateServerParams> {
	try {
		const { data } = await api.updateServer(id, args)

		successToast("Server updated")

		// Update server in list
		allServers.update((servers) => {
			for (let i = 0; i < servers.length; i++) {
				const server = servers[i]

				if (server.id === id) {
					servers[i] = data.payload
					break
				}
			}

			return servers
		})
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				...data.errors,
			}
		}

		errorToast(data.message ? data.message : "Error: could not update server")
	}
}

export async function getServerById(id: number): Promise<Server> {
	try {
		const { data } = await api.getServerById(id)

		return data.payload as Server
	} catch (err) {
		const { data } = err.response

		errorToast(data.message ? data.message : "Error: could not get server info")
	}
}

export async function getServerPermissions(id: number): Promise<BigInt> {
	try {
		const { data } = await api.getScopedServerPermissions(id)

		return BigInt(data.payload)
	} catch (err) {
		const { data } = err.response

		errorToast(
			data.message ? data.message : "Error: could not get server permissions",
		)
	}
}
