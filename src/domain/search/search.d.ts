type PlayerSearchBody = {
	term: string
	type: string
	platform?: string
	limit: number
	offset: number
}

type PlayerSearchResult = {
	id: string
	platform: string
	name: string
	last_seen: Date
}

type PlayerSearchResults = {
	total: number
	results: PlayerSearchResult[]
}

type InfractionSearchResults = {
	total: number
	results: InfractionSearchResult[]
}

type ChatSearchResults = {
	total: number
	results: ChatMessage[]
}

type InfractionSearchResult = {
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

type InfractionSearchBody = {
	type?: string
	player_id?: string
	platform?: string
	user_id?: string
	game?: string
	server_id?: number
	limit: number
	offset: number
}

type ChatSearchBody = {
	player_id?: string
	platform?: string
	server_id?: number
	start_date?: number
	end_date?: number
	query?: string
	limit: number
	offset: number
}
