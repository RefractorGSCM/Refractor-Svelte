import { writable } from "svelte/store"
import { errorToast, successToast } from "../../utils/toast"
import api from "./api"

export const allGames = writable([] as Game[])
export const allPlatforms = writable([] as string[])

export async function getAllGames(): Promise<Game[]> {
	try {
		const { data } = await api.getAllGames()

		allGames.set(data.payload as Game[])

		allPlatforms.update((current) => {
			for (const g of data.payload as Game[]) {
				if (!current.includes(g.platform)) {
					current.push(g.platform)
				}
			}

			return current
		})

		return data.payload as Game[]
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Could not get all games")
	}
}

export async function getGameSettings(
	game: string,
	getDefault: boolean,
): Promise<GameSettings> {
	try {
		let data
		if (getDefault) {
			const res = await api.getDefaultGameSettings(game)
			data = res.data
		} else {
			const res = await api.getGameSettings(game)
			data = res.data
		}

		return data.payload as GameSettings
	} catch (err) {
		errorToast("Could not get game settings")
	}
}

export async function setGameCommandSettings(
	game: string,
	body: GameCommandSettings,
): Promise<{ [key: string]: string }> {
	try {
		await api.setGameCommandSettings(game, body)

		successToast("Game commands saved")

		return null
	} catch (err) {
		errorToast("Could not set game commands")

		const { data } = err.response

		if (data.errors) {
			return data.errors
		}
	}
}

export async function setGameGeneralSettings(
	game: string,
	body: GameGeneralSettings,
): Promise<{ [key: string]: string }> {
	try {
		await api.setGameGeneralSettings(game, body)

		successToast("Game settings saved")

		return null
	} catch (err) {
		errorToast("Could not set game settings")

		const { data } = err.response

		if (data.errors) {
			return data.errors
		}
	}
}
