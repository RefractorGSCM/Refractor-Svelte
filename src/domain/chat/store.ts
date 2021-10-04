import { writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"
import type { ChatMessage, FlaggedWord } from "./chat.types"

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

export async function getFlaggedWords(): Promise<FlaggedWord[]> {
	try {
		const { data } = await api.getFlaggedWords()

		return data.payload as FlaggedWord[]
	} catch (err) {
		errorToast("Could not get flagged words")

		return []
	}
}

export async function createFlaggedWord(
	word: FlaggedWord,
): Promise<FlaggedWord> {
	try {
		const { data } = await api.createFlaggedWord(word)

		return data.payload as FlaggedWord
	} catch (err) {
		errorToast("Could not create flagged word")

		return null
	}
}

export async function updateFlaggedWord(
	id: number,
	word: FlaggedWord,
): Promise<FlaggedWord> {
	try {
		const { data } = await api.updateFlaggedWord(id, word)

		return data.payload as FlaggedWord
	} catch (err) {
		errorToast("Could update create flagged word")

		return null
	}
}

export async function deleteFlaggedWord(id: number): Promise<FlaggedWord> {
	try {
		const { data } = await api.deleteFlaggedWord(id)

		return data.payload as FlaggedWord
	} catch (err) {
		errorToast("Could not delete flagged word")

		return null
	}
}
