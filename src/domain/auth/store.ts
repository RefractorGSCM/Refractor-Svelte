import { writable } from "svelte/store"
import {
	checkFlag,
	FLAG_ADMINISTRATOR,
	FLAG_SUPER_ADMIN,
	getFlag,
} from "../../permissions/permissions"
import { errorToast } from "../../utils/toast"
import api from "./api"

export const isAuthenticated = writable(false)
export const needsActivation = writable(false)
export const isDeactivated = writable(false)
export const session = writable(null)
export const self = writable(null as User)
export const isSuperAdmin = writable(false)
export const isAdmin = writable(false)

export async function checkAuth(): Promise<boolean> {
	try {
		const { data } = await api.getSession()

		const msUntilExpiry =
			new Date(data.expires_at).getTime() - Date.now() + 1000

		setTimeout(() => {
			// log out when session expires
			window.location.replace(
				`${import.meta.env.VITE_KRATOS_ROOT}/self-service/browser/flows/logout`,
			)
		}, msUntilExpiry)

		let accountActivated = false
		for (const address of data.identity.verifiable_addresses) {
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
		const payload = data.payload

		self.set(payload)

		if (payload.meta.deactivated) {
			isDeactivated.set(true)
		}

		if (checkFlag(payload.permissions, getFlag(FLAG_SUPER_ADMIN))) {
			isSuperAdmin.set(true)
		}

		if (checkFlag(payload.permissions, getFlag(FLAG_ADMINISTRATOR))) {
			isAdmin.set(true)
		}
	} catch (err) {
		errorToast("Could not get user info")
	}
}
