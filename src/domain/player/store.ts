import { writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"
import type { Player } from "./player.types"

export const serverPlayers = writable({})

export function addPlayerToServer(serverId: number, player: Player) {
	serverPlayers.update((players) => {
		if (!players[serverId]) {
			players[serverId] = {}
		}

		players = {
			...players,
			[serverId]: {
				...players[serverId],
				[player.id]: player,
			},
		}

		return players
	})
}

export function removePlayerFromServer(serverId: number, playerId: string) {
	serverPlayers.update((players) => {
		if (!players[serverId]) {
			players[serverId] = {}
			return players
		}

		delete players[serverId][playerId]

		return players
	})
}

export async function getPlayer(id: string, platform: string): Promise<Player> {
	try {
		const { data } = await api.getPlayer(id, platform)

		return data.payload as Player
	} catch (err) {
		const { data } = err.response

		errorToast("Could not get player info")
	}

	return null
}
