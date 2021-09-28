export type ChatMessage = {
	id: number
	player_id: string
	platform: string
	name: string
	message: string
	sent_by_user?: boolean
	own_message?: boolean // not a db field
}
