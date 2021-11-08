import axios from "axios"

const API_ROOT = import.meta.env.VITE_API_ROOT

const getAllGames = () => {
	return axios.get(`${API_ROOT}/games/`, { withCredentials: true })
}

const getGameSettings = (game: string) => {
	return axios.get(`${API_ROOT}/games/settings/${game}`, {
		withCredentials: true,
	})
}

const getDefaultGameSettings = (game: string) => {
	return axios.get(`${API_ROOT}/games/settings/${game}/default`, {
		withCredentials: true,
	})
}

const setGameCommandSettings = (
	game: string,
	commands: GameCommandSettings,
) => {
	return axios.patch(`${API_ROOT}/games/settings/${game}/commands`, commands, {
		withCredentials: true,
	})
}

export default {
	getAllGames,
	getGameSettings,
	getDefaultGameSettings,
	setGameCommandSettings,
}
