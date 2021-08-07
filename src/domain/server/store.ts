import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import api from "./api"
import type { CreateServerParams } from "./server.types"

export const servers = writable([])

export async function getAllServers() {
	try {
		const { data } = await api.getServers()

		servers.set(data.payload)
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
