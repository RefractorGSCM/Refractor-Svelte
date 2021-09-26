import { Writable, writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"
import type { Game } from "./game.types"

export const allGames: Writable<Game[]> = writable([])

export async function getAllGames(): Promise<Game[]> {
	try {
		const { data } = await api.getAllGames()

		allGames.set(data.payload as Game[])

		return data.payload as Game[]
	} catch (err) {
		const { data } = err.response
		errorToast(data.message ? data.message : "Could not get all games")
	}
}
