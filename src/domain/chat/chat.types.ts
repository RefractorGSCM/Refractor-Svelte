export type ChatMessage = {
	id: number
	player_id: string
	platform: string
	name: string
	message: string
	sent_by_user?: boolean
	own_message?: boolean // not a db field
	created_at?: Date
	modified_at?: Date
}

export type FlaggedWord = {
	id?: number
	word: string
}
