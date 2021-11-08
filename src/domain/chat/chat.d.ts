type ChatMessage = {
	id: number
	player_id: string
	platform: string
	server_id: number
	name: string
	message: string
	sent_by_user?: boolean
	own_message?: boolean // not a db field
	created_at?: Date
	modified_at?: Date
}

type FlaggedWord = {
	id?: number
	word: string
}
