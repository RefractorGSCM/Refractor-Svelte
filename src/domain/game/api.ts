import axios from "axios"

const getEnabledGames = () => {
	return axios.get(`${process.env.apiRoot}/games`, { withCredentials: true })
}

export default {
	getEnabledGames,
}
