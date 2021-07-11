import axios from "axios"

const getAllGroups = () => {
	return axios.get(`${process.env.apiRoot}/groups/`, { withCredentials: true })
}

export default {
	getAllGroups,
}
