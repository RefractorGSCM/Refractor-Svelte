import { Writable, writable } from "svelte/store"
import { sortAsc } from "../../utils/sorting"
import api from "./api"
import type { Group } from "./group.types"

export const allGroups: Writable<Group[]> = writable([])

export async function getAllGroups() {
	try {
		const { data } = await api.getAllGroups()

		const groups: Group[] = data.payload

		allGroups.set(sortAsc("position", groups))
	} catch (err) {
		console.log(err)
	}
}
