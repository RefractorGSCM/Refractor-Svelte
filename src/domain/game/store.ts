import { Writable, writable } from "svelte/store"
import api from "./api"
import type { Game } from "./game.types"

export const allGames: Writable<Game[]> = writable([])
export const selectedGame: Writable<Game> = writable(null)

export async function getAllGames() {
	try {
		const { data } = await api.getEnabledGames()

		console.log(data)
	} catch (err) {}
}
