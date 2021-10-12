import axios from "axios"

const API_ROOT = import.meta.env.VITE_API_ROOT

const getSession = () => {
	return axios.get(`${import.meta.env.VITE_KRATOS_ROOT}/sessions/whoami`, {
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
