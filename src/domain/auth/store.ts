import { Writable, writable } from "svelte/store"
import {
	checkFlag,
	FLAG_ADMINISTRATOR,
	FLAG_SUPER_ADMIN,
	getFlag,
} from "../../permissions/permissions"
import { errorToast } from "../../utils/toast"
import type { User } from "../user/user.types"
import api from "./api"

export const isAuthenticated: Writable<boolean> = writable(false)
export const needsActivation: Writable<boolean> = writable(false)
export const session = writable(null)
export const self: Writable<User> = writable(null)
export const isSuperAdmin: Writable<boolean> = writable(false)
export const isAdmin: Writable<boolean> = writable(false)

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
		const payload = data.payload

		self.set(payload)

		if (checkFlag(payload.permissions, getFlag(FLAG_SUPER_ADMIN))) {
			isSuperAdmin.set(true)
		}

		if (checkFlag(payload.permissions, getFlag(FLAG_ADMINISTRATOR))) {
			isAdmin.set(true)
		}
	} catch (err) {
		console.log(err)
		errorToast("Could not get user info")
	}
}
