import axios from "axios"
import type { FlaggedWord } from "./chat.types"

const getRecentChatMessages = (serverId: number, count: number) => {
	return axios.get(`${API_ROOT}/chat/recent/${serverId}?count=${count}`, {
		withCredentials: true,
	})
}

const getFlaggedWords = () => {
	return axios.get(`${API_ROOT}/chat/flagged`, { withCredentials: true })
}

const createFlaggedWord = (data: FlaggedWord) => {
	return axios.post(`${API_ROOT}/chat/flagged`, data, { withCredentials: true })
}

const updateFlaggedWord = (id: number, data: FlaggedWord) => {
	return axios.patch(`${API_ROOT}/chat/flagged/${id}`, data, {
		withCredentials: true,
	})
}

const deleteFlaggedWord = (id: number) => {
	return axios.delete(`${API_ROOT}/chat/flagged/${id}`, {
		withCredentials: true,
	})
}

const getRecentFlaggedMessages = () => {
	return axios.get(`${API_ROOT}/chat/recent/flagged`, { withCredentials: true })
}

export default {
	getRecentChatMessages,
	getFlaggedWords,
	createFlaggedWord,
	updateFlaggedWord,
	deleteFlaggedWord,
	getRecentFlaggedMessages,
}
