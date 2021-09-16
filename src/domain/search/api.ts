import axios from "axios"
import type { PlayerSearchBody } from "./search.types"

const searchPlayers = (body: PlayerSearchBody) => {
	return axios.post(`${API_ROOT}/search/players`, body, {
		withCredentials: true,
	})
}

export default {
	searchPlayers,
}
