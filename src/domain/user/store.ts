import { Writable, writable } from "svelte/store"
import { getSession } from "./api"

export const isAuthenticated: Writable<boolean> = writable(false)
export const user = writable(null)

export async function checkAuth(): Promise<boolean> {
	try {
		const { data } = await getSession()

		user.set(data)
		isAuthenticated.set(true)

		return true
	} catch (err) {
		isAuthenticated.set(false)
		user.set(null)

		return false
	}
}
