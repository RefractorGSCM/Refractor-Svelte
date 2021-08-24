import { writable } from "svelte/store"
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
