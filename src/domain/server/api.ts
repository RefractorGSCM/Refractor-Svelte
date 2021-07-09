import axios from "axios"

export function getServers() {
	return axios.get(`${process.env.apiRoot}/servers`, { withCredentials: true })
}
