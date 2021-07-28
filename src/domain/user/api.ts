import axios from "axios"

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

export default {
	getAllUsers,
	addUserGroup,
	removeUserGroup,
}
