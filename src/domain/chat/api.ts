import axios from "axios"

const getRecentChatMessages = (serverId: number, count: number) => {
	return axios.get(`${API_ROOT}/chat/recent/${serverId}?count=${count}`, {
		withCredentials: true,
	})
}

export default {
	getRecentChatMessages,
}
