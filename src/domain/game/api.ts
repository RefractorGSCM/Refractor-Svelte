import axios from "axios"

const getEnabledGames = () => {
	return axios.get(`${API_ROOT}/games`, { withCredentials: true })
}

export default {
	getEnabledGames,
}
