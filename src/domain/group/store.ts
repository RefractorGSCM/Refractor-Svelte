import { Writable, writable } from "svelte/store"
import api from "./api"
import type { Group } from "./group.types"

export const allGroups: Writable<Group[]> = writable([])

export async function getAllGroups() {
	try {
		const { data } = await api.getAllGroups()

		allGroups.set(data.payload)
	} catch (err) {
		console.log(err)
	}
}
