import axios from "axios"
import type { Group, NewGroupParams } from "./group.types"

const getAllGroups = () => {
	return axios.get(`${process.env.apiRoot}/groups/`, { withCredentials: true })
}

const getAllPermissions = () => {
	return axios.get(`${process.env.apiRoot}/groups/permissions`, {
		withCredentials: true,
	})
}

const createGroup = (data: NewGroupParams) => {
	return axios.post(`${process.env.apiRoot}/groups/`, data, {
		withCredentials: true,
	})
}

const deleteGroup = (id: number) => {
	return axios.delete(`${process.env.apiRoot}/groups/${id}`, {
		withCredentials: true,
	})
}

export default {
	getAllGroups,
	getAllPermissions,
	createGroup,
	deleteGroup,
}
