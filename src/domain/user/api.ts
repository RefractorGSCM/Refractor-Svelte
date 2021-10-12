import axios from "axios"
import type { UserTraits } from "./user.types"

const API_ROOT = import.meta.env.VITE_API_ROOT

const getAllUsers = () => {
	return axios.get(`${API_ROOT}/users/`, {
		withCredentials: true,
	})
}

const addUserGroup = (data: { user_id: string; group_id: number }) => {
	return axios.put(`${API_ROOT}/groups/users/add`, data, {
		withCredentials: true,
	})
}

const removeUserGroup = (data: { user_id: string; group_id: number }) => {
	return axios.put(`${API_ROOT}/groups/users/remove`, data, {
		withCredentials: true,
	})
}

const createUser = (data: UserTraits) => {
	return axios.post(`${API_ROOT}/users/`, data, {
		withCredentials: true,
	})
}

const deactivateUser = (id: string) => {
	return axios.patch(`${API_ROOT}/users/deactivate/${id}`, null, {
		withCredentials: true,
	})
}

const reactivateUser = (id: string) => {
	return axios.patch(`${API_ROOT}/users/reactivate/${id}`, null, {
		withCredentials: true,
	})
}

export default {
	getAllUsers,
	addUserGroup,
	removeUserGroup,
	createUser,
	deactivateUser,
	reactivateUser,
}
