import axios from "axios"

const getAllGroups = () => {
	return axios.get(`${process.env.apiRoot}/groups/`, { withCredentials: true })
}

const getAllPermissions = () => {
	return axios.get(`${process.env.apiRoot}/groups/permissions`, {
		withCredentials: true,
	})
}

export default {
	getAllGroups,
	getAllPermissions,
}
