import axios from "axios"

const API_ROOT = import.meta.env.VITE_API_ROOT

const getPlayer = (id: string, platform: string) => {
	return axios.get(`${API_ROOT}/players/${platform}/${id}`, {
		withCredentials: true,
	})
}

export default {
	getPlayer,
}
