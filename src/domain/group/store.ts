import { Writable, writable } from "svelte/store"
import { registerPermissions } from "../../permissions/permissions"
import { sortAsc } from "../../utils/sorting"
import api from "./api"
import type { Group, Permission } from "./group.types"

export const allGroups: Writable<Group[]> = writable([])
const permissions: Writable<Permission[]> = writable([])

export async function getAllGroups() {
	try {
		const { data } = await api.getAllGroups()

		const groups: Group[] = data.payload

		allGroups.set(sortAsc("position", groups))
	} catch (err) {
		console.log(err)
	}
}

export async function getPermissions() {
	try {
		const { data } = await api.getAllPermissions()

		permissions.set(data.payload)

		registerPermissions(data.payload)
	} catch (err) {
		console.log(err)
	}
}
