import axios from "axios"
import type { Group, GroupReorderInfo, NewGroupParams } from "./group.types"

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
	return axios.put(`${API_ROOT}/groups/${id}`, data, {
		withCredentials: true,
	})
}

const updateBaseGroup = (data: NewGroupParams) => {
	return axios.put(`${API_ROOT}/groups/base`, data, {
		withCredentials: true,
	})
}

const reorderGroups = (data: GroupReorderInfo[]) => {
	return axios.put(`${API_ROOT}/groups/order`, data, {
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
}
