import { writable } from "svelte/store"
import type { Group } from "../group/group.types"
import api from "./api"
import type { User, UserLinkParams, UserTraits } from "./user.types"
import { toast } from "@zerodevx/svelte-toast"
import { errorToast, successToast } from "../../utils/toast"
import type { Player } from "../player/player.types"

export const allUsers = writable([] as User[])

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
			users = [...users]

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

export async function createUser(traits: UserTraits): Promise<UserTraits> {
	try {
		const { data } = await api.createUser(traits)

		// Add new user to allUsers on success
		allUsers.update((users) => {
			return [...users, data.payload]
		})

		successToast("User created!")
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				...data.errors,
			}
		}

		errorToast("Could not create user")
	}
}

export async function deactivateUser(id: string) {
	try {
		await api.deactivateUser(id)

		allUsers.update((users) => {
			let newUsers = [...users]

			for (const usr of newUsers) {
				if (usr.id === id) {
					usr.meta.deactivated = true
					break
				}
			}

			return newUsers
		})

		successToast("Account deactivated")
	} catch (err) {
		errorToast("Could not deactivate account")
	}
}

export async function reactivateUser(id: string) {
	try {
		await api.reactivateUser(id)

		allUsers.update((users) => {
			let newUsers = [...users]

			for (const usr of newUsers) {
				if (usr.id === id) {
					usr.meta.deactivated = false
					break
				}
			}

			return newUsers
		})

		successToast("Account reactivated")
	} catch (err) {
		errorToast("Could not reactivate account")
	}
}

export async function getLinkedPlayers(userID: string): Promise<Player[]> {
	try {
		const { data } = await api.getLinkedPlayers(userID)

		return data.payload as Player[]
	} catch (err) {
		errorToast("Could not get linked players")
	}
}

export async function linkUserPlayer(body: UserLinkParams): Promise<boolean> {
	try {
		await api.linkPlayer(body)

		return true
	} catch (err) {
		const { data } = err.response

		errorToast(data.message ? data.message : "Could not link player")

		return false
	}
}

export async function unlinkUserPlayer(body: UserLinkParams): Promise<boolean> {
	try {
		await api.unlinkPlayer(body)

		return true
	} catch (err) {
		const { data } = err.response

		errorToast(data.message ? data.message : "Could not unlink player")

		return false
	}
}
