import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import { addPlayerToServer } from "../player/store"
import api from "./api"

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

type creationRes = {
	server?: Server
	errors?: any
}

export async function createServer(
	newServer: CreateServerParams,
): Promise<creationRes> {
	try {
		const { data } = await api.createServer(newServer)

		successToast("Server created")

		const server = data.payload

		allServers.update((current) => {
			current.push({
				...server,
				online_players: [],
				is_fragment: false,
				status: "Unknown",
			})
			return current
		})

		return {
			server,
		}
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				errors: {
					...data.errors,
				},
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
					servers[i] = {
						...server,
						...data.payload,
					}
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

export async function setServerStatus(id: number, status: string) {
	allServers.update((current) => {
		for (const server of current) {
			if (server.id === id) {
				server.status = status
				break
			}
		}

		return current
	})
}

export async function deactivateServer(id: number) {
	try {
		await api.deactivateServer(id)

		successToast("Server deleted")
	} catch (err) {
		errorToast("Could not delete server")
	}
}

export async function refreshPlayerList(id: number) {
	try {
		await api.refreshPlayerList(id)

		successToast("Player list refreshed")
	} catch (err) {
		errorToast("Could not refresh player list")
	}
}
