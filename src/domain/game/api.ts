import axios from "axios"

const getAllGames = () => {
	return axios.get(`${API_ROOT}/games/`, { withCredentials: true })
}

export default {
	getAllGames,
}
