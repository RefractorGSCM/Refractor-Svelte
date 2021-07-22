import { Writable, writable } from "svelte/store"
import { getSession } from "./api"

export const isAuthenticated: Writable<boolean> = writable(false)
export const needsActivation: Writable<boolean> = writable(false)
export const user = writable(null)

export async function checkAuth(): Promise<boolean> {
	try {
		const { data } = await getSession()

		let accountActivated = false
		for (const address of data.identity.verifiable_addresses) {
			console.log(address)
			if (address.verified === true) {
				accountActivated = true
				break
			}
		}

		user.set(data)

		if (!accountActivated) {
			isAuthenticated.set(false)
			needsActivation.set(true)
			return false
		} else {
			needsActivation.set(false)
		}

		isAuthenticated.set(true)

		return true
	} catch (err) {
		isAuthenticated.set(false)
		user.set(null)

		return false
	}
}
