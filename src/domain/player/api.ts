import axios from "axios"

const getPlayer = (id: string, platform: string) => {
	return axios.get(`${API_ROOT}/players/${platform}/${id}`, {
		withCredentials: true,
	})
}

export default {
	getPlayer,
}
