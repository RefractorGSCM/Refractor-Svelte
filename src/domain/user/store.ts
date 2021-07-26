import { Writable, writable } from "svelte/store"
import type { Group } from "../group/group.types"
import api from "./api"
import type { User } from "./user.types"
import { toast } from "@zerodevx/svelte-toast"
import { errorToast, successToast } from "../../utils/toast"

export const allUsers: Writable<User[]> = writable([])

export async function getAllUsers() {
	try {
		const { data } = await api.getAllUsers()

		allUsers.set(data.payload)
	} catch (err) {
		console.log(err)
	}
}

export async function addUserGroup(userId: string, group: Group) {
	try {
		await api.addUserGroup({ user_id: userId, group_id: group.id })

		allUsers.update((users) => {
			for (let i = 0; i < users.length; i++) {
				const user = users[i]

				if (user.id === userId) {
					users[i].groups.push(group)
				}
			}

			return users
		})

		successToast("Group added")
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not add group")
	}
}

export async function removeUserGroup(userId: string, groupId: number) {
	try {
		await api.removeUserGroup({ user_id: userId, group_id: groupId })

		allUsers.update((users) => {
			for (let i = 0; i < users.length; i++) {
				const user = users[i]

				if (user.id === userId) {
					users[i].groups.filter((g) => g.id !== groupId)
				}
			}

			return users
		})

		successToast("Group removed")
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Error: could not remove group")
	}
}
