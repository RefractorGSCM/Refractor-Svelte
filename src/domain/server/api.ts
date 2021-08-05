import axios from "axios"

const getServers = () => {
	return axios.get(`${API_ROOT}/servers/`, { withCredentials: true })
}

export default {
	getServers,
}
