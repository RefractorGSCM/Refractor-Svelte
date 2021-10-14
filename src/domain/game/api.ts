import axios from "axios"
import type { GameSettings } from "./game.types"

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

const setGameSettings = (game: string, settings: GameSettings) => {
	return axios.patch(`${API_ROOT}/games/settings/${game}`, settings, {
		withCredentials: true,
	})
}

export default {
	getAllGames,
	getGameSettings,
	getDefaultGameSettings,
	setGameSettings,
}
