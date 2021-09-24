import type { Player } from "../player/player.types"

export type PlayerSearchBody = {
	term: string
	type: string
	platform?: string
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

export type InfractionSearchResults = {
	total: number
	results: InfractionSearchResult[]
}

export type InfractionSearchResult = {
	id: number
	player_id: string
	platform: string
	user_id?: string
	server_id: number
	type: string
	reason?: string
	duration?: number
	system_action: boolean
	created_at: Date
	modified_at: Date
	issuer_name?: string
	player_name?: string
}

export type InfractionSearchBody = {
	type?: string
	player_id?: string
	platform?: string
	user_id?: string
	game?: string
	server_id?: number
	limit: number
	offset: number
}
