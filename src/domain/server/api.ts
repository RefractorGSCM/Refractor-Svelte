import axios from "axios"

export function getServers() {
	return axios.get(`${API_ROOT}/servers`, { withCredentials: true })
}
