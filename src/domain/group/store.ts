import { Writable, writable } from "svelte/store"
import { registerPermissions } from "../../permissions/permissions"
import { sortAsc } from "../../utils/sorting"
import { getAllServers } from "../server/store"
import api from "./api"
import type { Group, NewGroupParams, Permission } from "./group.types"

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
