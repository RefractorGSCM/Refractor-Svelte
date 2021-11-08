import axios from "axios"

const API_ROOT = import.meta.env.VITE_API_ROOT

const searchPlayers = (body: PlayerSearchBody) => {
	return axios.post(`${API_ROOT}/search/players`, body, {
		withCredentials: true,
	})
}

const searchInfractions = (body: InfractionSearchBody) => {
	return axios.post(`${API_ROOT}/search/infractions`, body, {
		withCredentials: true,
	})
}

const searchChatMessages = (body: ChatSearchBody) => {
	return axios.post(`${API_ROOT}/search/chat`, body, {
		withCredentials: true,
	})
}

export default {
	searchPlayers,
	searchInfractions,
	searchChatMessages,
}
