type CreateWarningParams = {
	reason?: string
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

type CreateMuteParams = {
	reason?: string
	duration?: number
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

type CreateKickParams = {
	reason?: string
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

type CreateBanParams = {
	reason?: string
	duration?: number
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

type UpdateInfractionParams = {
	reason?: string
	duration?: string
	repealed?: boolean
}

type InfractionModifyRes = {
	infraction: Infraction
	success: boolean
	errors?: any
}

type Infraction = {
	id: number
	player_id: string
	platform: string
	user_id?: string
	server_id: number
	type: string
	reason?: string
	duration?: number
	system_action?: boolean
	created_at?: string
	modified_at?: string
	repealed?: boolean
	issuer_name?: string // not a DB field
	attachments?: Attachment[] // not a DB field
	linked_chat_messages?: ChatMessage[] // not a DB field
}
