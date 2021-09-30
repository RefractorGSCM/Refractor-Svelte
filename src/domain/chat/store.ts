import { writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"
import type { ChatMessage } from "./chat.types"

export const chatMessages = writable({} as { [key: number]: ChatMessage[] })

export function addChatMessage(serverID: number, msg: ChatMessage) {
	chatMessages.update((current) => {
		current[serverID].push(msg)
		return current
	})
}

export async function loadRecentChatMessages(serverId: number) {
	try {
		const { data } = await api.getRecentChatMessages(serverId, 30)

		let recentMessages = data.payload as ChatMessage[]
		recentMessages = recentMessages.reverse()

		chatMessages.update((current) => {
			current[serverId] = recentMessages
			return current
		})
	} catch (err) {
		errorToast("Could not fetch recent chat messages")
	}
}
