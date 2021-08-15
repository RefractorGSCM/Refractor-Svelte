import { Writable, writable } from "svelte/store"
import { registerPermissions } from "../../permissions/permissions"
import { sortAsc } from "../../utils/sorting"
import { errorToast, successToast } from "../../utils/toast"
import { getAllServers } from "../server/store"
import api from "./api"
import type {
	Group,
	GroupReorderInfo,
	NewGroupParams,
	Permission,
	ServerOverrides,
} from "./group.types"

export const allGroups: Writable<Group[]> = writable([])
const permissions: Writable<Permission[]> = writable([])
export let baseGroup: Group = null
export const baseGroupId = -1

export async function getAllGroups() {
	try {
		const { data } = await api.getAllGroups()

		const groups: Group[] = data.payload

		allGroups.set(sortAsc("position", groups))

		for (const group of groups) {
			if (group.id === baseGroupId) {
				baseGroup = group
				break
			}
		}
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not get all groups")
	}
}

export async function getPermissions() {
	try {
		const { data } = await api.getAllPermissions()

		permissions.set(data.payload)

		registerPermissions(data.payload)
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not get permissions")
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

		successToast("Group created")
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not create group")
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

		successToast("Group deleted")
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not delete group")
	}
}

export async function updateGroup(id: number, data: NewGroupParams) {
	try {
		// If we are updating the base group, we use the endpoint specifically for the base group.
		if (id === -1) {
			await api.updateBaseGroup(data)
			successToast("Base group updated")
			return
		}

		// Otherwise we use the generic group update endpoint
		await api.updateGroup(id, data)

		successToast("Group updated")
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not update group")
	}
}

export async function reorederGroups(data: GroupReorderInfo[]) {
	try {
		await api.reorderGroups(data)
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not reorder groups")
	}
}

export async function getServerOverrides(
	id: number,
): Promise<ServerOverrides[]> {
	try {
		const { data } = await api.getServerOverrides(id)

		if (!data.payload) {
			data.payload = []
		}

		return data.payload
	} catch (err) {
		const { data } = err.response
		errorToast(
			data.message ? data.message : "Error: could not get server overrides",
		)
		return null
	}
}
