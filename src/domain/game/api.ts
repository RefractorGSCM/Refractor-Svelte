import axios from "axios"

const API_ROOT = import.meta.env.VITE_API_ROOT

const getAllGames = () => {
	return axios.get(`${API_ROOT}/games/`, { withCredentials: true })
}

export default {
	getAllGames,
}
