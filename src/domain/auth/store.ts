import { Writable, writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"

export const isAuthenticated: Writable<boolean> = writable(false)
export const needsActivation: Writable<boolean> = writable(false)
export const session = writable(null)
export const self = writable(null)

export async function checkAuth(): Promise<boolean> {
	try {
		const { data } = await api.getSession()

		let accountActivated = false
		for (const address of data.identity.verifiable_addresses) {
			console.log(address)
			if (address.verified === true) {
				accountActivated = true
				break
			}
		}

		session.set(data)

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
		session.set(null)

		return false
	}
}

export async function getSelfInfo() {
	try {
		const { data } = await api.getSelfInfo()

		self.set(data.payload)
	} catch (err) {
		errorToast("Could not get user info")
	}
}
