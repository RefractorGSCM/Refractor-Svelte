import axios from "axios"

const getSession = () => {
	return axios.get(`${KRATOS_ROOT}/sessions/whoami`, {
		withCredentials: true,
	})
}

const getSelfInfo = () => {
	return axios.get(`${API_ROOT}/users/me`, {
		withCredentials: true,
	})
}

export default {
	getSession,
	getSelfInfo,
}
