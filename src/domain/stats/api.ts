import axios from "axios"

const getStats = () => {
	return axios.get(`${API_ROOT}/stats/`, { withCredentials: true })
}

export default { getStats }
