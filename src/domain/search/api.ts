import axios from "axios"
import type { InfractionSearchBody, PlayerSearchBody } from "./search.types"

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

export default {
	searchPlayers,
	searchInfractions,
}
