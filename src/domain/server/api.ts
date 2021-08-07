import axios from "axios"
import type { CreateServerParams } from "./server.types"

const getServers = () => {
	return axios.get(`${API_ROOT}/servers/`, { withCredentials: true })
}

const createServer = (data: CreateServerParams) => {
	return axios.post(`${API_ROOT}/servers/`, data, { withCredentials: true })
}

export default {
	getServers,
	createServer,
}
