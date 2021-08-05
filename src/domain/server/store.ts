import { writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"

export const servers = writable({})

export async function getAllServers() {
	try {
		const { data } = await api.getServers()

		console.log(data)
	} catch (err) {
		errorToast("Could not get servers")
	}
}
