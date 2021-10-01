import { Writable, writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"
import type { Game } from "./game.types"

export const allGames: Writable<Game[]> = writable([])
export const allPlatforms: Writable<string[]> = writable([])

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
