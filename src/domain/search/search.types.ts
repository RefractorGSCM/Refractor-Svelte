import type { Player } from "../player/player.types"

export type PlayerSearchBody = {
	term: string
	type: string
	limit: number
	offset: number
}

export type PlayerSearchResult = {
	id: string
	platform: string
	name: string
	last_seen: Date
}

export type PlayerSearchResults = {
	total: number
	results: PlayerSearchResult[]
}
