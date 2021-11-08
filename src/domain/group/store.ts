import { time_ranges_to_array } from "svelte/internal"
import { writable } from "svelte/store"
import { registerPermissions } from "../../permissions/permissions"
import { sortAsc } from "../../utils/sorting"
import { errorToast, successToast } from "../../utils/toast"
import { getAllServers } from "../server/store"
import api from "./api"

export const allGroups = writable([] as Group[])
const permissions = writable([] as Permission[])
export let baseGroup: Group = null
export const baseGroupId = -1
const userPrimaryGroups = {} as { [key: string]: Group }

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

export async function setServerOverrides(
	id: number,
	body: ServerOverrides,
): Promise<ServerOverrides> {
	try {
		const { data } = await api.setServerOverrides(id, body)

		successToast("Server overrides saved")

		return data.payload
	} catch (err) {
		const { data } = err.response
		errorToast(
			data.message ? data.message : "Error: could not get server overrides",
		)
		return null
	}
}

export async function getUserPrimaryGroup(userId: string): Promise<Group> {
	// Check if we already have this user's primary group cached
	let group = userPrimaryGroups[userId]

	if (group) {
		return group
	}

	// If not cached, fetch it from the API
	try {
		const { data } = await api.getUserPrimaryGroup(userId)
		group = data.payload as Group

		// Cache group for future operations
		userPrimaryGroups[userId] = group

		return group
	} catch (err) {
		errorToast(`Could not get primary group for user ${userId}`)
		return baseGroup
	}
}
