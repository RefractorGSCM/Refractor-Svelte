import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import api from "./api"
import type {
	CreateServerParams,
	Server,
	UpdateServerParams,
} from "./server.types"

export const allServers = writable([])

export async function getAllServers() {
	try {
		const { data } = await api.getServers()

		if (Array.isArray(data.payload)) {
			allServers.set(data.payload)
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
