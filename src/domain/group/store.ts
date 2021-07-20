import { Writable, writable } from "svelte/store"
import { registerPermissions } from "../../permissions/permissions"
import { sortAsc } from "../../utils/sorting"
import { getAllServers } from "../server/store"
import api from "./api"
import type {
	Group,
	GroupReorderInfo,
	NewGroupParams,
	Permission,
} from "./group.types"

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

export async function createGroup(newGroup: NewGroupParams) {
	try {
		const { data } = await api.createGroup(newGroup)

		const created = data.payload

		// Add new group to the list of allGroups
		allGroups.update((groups) => {
			return sortAsc("position", [...groups, created])
		})
	} catch (err) {
		console.log(err)
	}
}

export async function deleteGroup(id: number) {
	try {
		await api.deleteGroup(id)

		// Remove deleted group from the list of allGroups
		allGroups.update((groups) => {
			const filtered = groups.filter((g) => g.id !== id)

			return sortAsc("position", filtered)
		})
	} catch (err) {
		console.log(err)
	}
}

export async function updateGroup(id: number, data: NewGroupParams) {
	try {
		// If we are updating the base group, we use the endpoint specifically for the base group.
		if (id === -1) {
			await api.updateBaseGroup(data)
			return
		}

		// Otherwise we use the generic group update endpoint
		await api.updateGroup(id, data)
	} catch (err) {
		console.log(err)
	}
}

export async function reorederGroups(data: GroupReorderInfo[]) {
	try {
		await api.reorderGroups(data)
	} catch (err) {
		console.log(err)
	}
}
