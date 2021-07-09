import axios from "axios"

export function getSession() {
	return axios.get(`${process.env.kratosRoot}/sessions/whoami`, {
		withCredentials: true,
	})
}
