import axios from "axios"

const API_ROOT = import.meta.env.VITE_API_ROOT

const getStats = () => {
	return axios.get(`${API_ROOT}/stats/`, { withCredentials: true })
}

export default { getStats }
