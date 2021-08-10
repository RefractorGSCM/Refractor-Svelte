import axios from "axios"
import type { CreateServerParams, UpdateServerParams } from "./server.types"

const getServers = () => {
	return axios.get(`${API_ROOT}/servers/`, { withCredentials: true })
}

const createServer = (data: CreateServerParams) => {
	return axios.post(`${API_ROOT}/servers/`, data, { withCredentials: true })
}

const updateServer = (id: number, data: UpdateServerParams) => {
	return axios.patch(`${API_ROOT}/servers/${id}`, data, {
		withCredentials: true,
	})
}

export default {
	getServers,
	createServer,
	updateServer,
}
