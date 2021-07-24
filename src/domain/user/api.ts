import axios from "axios"

const getAllUsers = () => {
	return axios.get(`${process.env.apiRoot}/users/`, {
		withCredentials: true,
	})
}

export default {
	getAllUsers,
}
