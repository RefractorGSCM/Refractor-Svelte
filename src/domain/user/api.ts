import axios from "axios"

const getAllUsers = () => {
	return axios.get(`${process.env.apiRoot}/users/`, {
		withCredentials: true,
	})
}

const addUserGroup = (data: { user_id: string; group_id: number }) => {
	return axios.put(`${process.env.apiRoot}/groups/users/add`, data, {
		withCredentials: true,
	})
}

const removeUserGroup = (data: { user_id: string; group_id: number }) => {
	return axios.put(`${process.env.apiRoot}/groups/users/remove`, data, {
		withCredentials: true,
	})
}

export default {
	getAllUsers,
	addUserGroup,
	removeUserGroup,
}
