import axios from "axios"

const getSession = () => {
	return axios.get(`${process.env.kratosRoot}/sessions/whoami`, {
		withCredentials: true,
	})
}

const getSelfInfo = () => {
	return axios.get(`${process.env.apiRoot}/users/me`, {
		withCredentials: true,
	})
}

export default {
	getSession,
	getSelfInfo,
}
