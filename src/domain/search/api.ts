import axios from "axios"
import type {
	ChatSearchBody,
	InfractionSearchBody,
	PlayerSearchBody,
} from "./search.types"

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
	return axios.post(`${API_ROOT}/search/chatmessages`, body, {
		withCredentials: true,
	})
}

export default {
	searchPlayers,
	searchInfractions,
	searchChatMessages,
}
