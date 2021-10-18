import axios from "axios"
import type { CreateServerParams, UpdateServerParams } from "./server.types"

const API_ROOT = import.meta.env.VITE_API_ROOT

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

const getServerById = (id: number) => {
	return axios.get(`${API_ROOT}/servers/${id}`, { withCredentials: true })
}

const getScopedServerPermissions = (id: number) => {
	return axios.get(`${API_ROOT}/servers/${id}/permissions`, {
		withCredentials: true,
	})
}

const deactivateServer = (id: number) => {
	return axios.patch(`${API_ROOT}/servers/deactivate/${id}`, null, {
		withCredentials: true,
	})
}

const refreshPlayerList = (id: number) => {
	return axios.post(`${API_ROOT}/servers/${id}/refreshplayers`, null, {
		withCredentials: true,
	})
}

export default {
	getServers,
	createServer,
	updateServer,
	getServerById,
	getScopedServerPermissions,
	deactivateServer,
	refreshPlayerList,
}
