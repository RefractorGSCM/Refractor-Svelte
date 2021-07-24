import { Writable, writable } from "svelte/store"
import type { Group } from "../group/group.types"
import api from "./api"
import type { User } from "./user.types"

export const allUsers: Writable<User[]> = writable([])

export async function getAllUsers() {
	try {
		const { data } = await api.getAllUsers()

		allUsers.set(data.payload)
	} catch (err) {
		console.log(err)
	}
}
