import { writable } from "svelte/store"
import { errorToast } from "../../utils/toast"
import api from "./api"

export const serverPlayers = writable(
	{} as { [key: number]: { [key: string]: Player } },
)

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

export function setServerPlayers(serverId: number, players: Player[]) {
	serverPlayers.update((current) => {
		const newPlayers = {}
		players.forEach((p) => {
			newPlayers[p.id] = p
		})
		current[serverId] = newPlayers

		return current
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
