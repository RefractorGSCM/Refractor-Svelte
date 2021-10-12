import axios from "axios"
import type {
	Group,
	GroupReorderInfo,
	NewGroupParams,
	ServerOverrides,
} from "./group.types"

const API_ROOT = import.meta.env.VITE_API_ROOT

const getAllGroups = () => {
	return axios.get(`${API_ROOT}/groups/`, { withCredentials: true })
}

const getAllPermissions = () => {
	return axios.get(`${API_ROOT}/groups/permissions`, {
		withCredentials: true,
	})
}

const createGroup = (data: NewGroupParams) => {
	return axios.post(`${API_ROOT}/groups/`, data, {
		withCredentials: true,
	})
}

const deleteGroup = (id: number) => {
	return axios.delete(`${API_ROOT}/groups/${id}`, {
		withCredentials: true,
	})
}

const updateGroup = (id: number, data: NewGroupParams) => {
	return axios.patch(`${API_ROOT}/groups/${id}`, data, {
		withCredentials: true,
	})
}

const updateBaseGroup = (data: NewGroupParams) => {
	return axios.patch(`${API_ROOT}/groups/base`, data, {
		withCredentials: true,
	})
}

const reorderGroups = (data: GroupReorderInfo[]) => {
	return axios.patch(`${API_ROOT}/groups/order`, data, {
		withCredentials: true,
	})
}

const getServerOverrides = (id: number) => {
	return axios.get(`${API_ROOT}/groups/servers/${id}`, {
		withCredentials: true,
	})
}

const setServerOverrides = (id: number, body: ServerOverrides) => {
	return axios.patch(`${API_ROOT}/groups/servers/${id}`, body, {
		withCredentials: true,
	})
}

const getUserPrimaryGroup = (userId: string) => {
	return axios.get(`${API_ROOT}/groups/users/primary/${userId}`, {
		withCredentials: true,
	})
}

export default {
	getAllGroups,
	getAllPermissions,
	createGroup,
	deleteGroup,
	updateGroup,
	updateBaseGroup,
	reorderGroups,
	getServerOverrides,
	setServerOverrides,
	getUserPrimaryGroup,
}
