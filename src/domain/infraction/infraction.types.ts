import type { Attachment } from "../attachment/attachment.types"
import type { ChatMessage } from "../chat/chat.types"

export type CreateWarningParams = {
	reason?: string
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

export type CreateMuteParams = {
	reason?: string
	duration?: number
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

export type CreateKickParams = {
	reason?: string
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

export type CreateBanParams = {
	reason?: string
	duration?: number
	platform?: string
	player_id?: string
	attachments?: Attachment[]
	linked_chat_messages?: number[]
}

export type UpdateInfractionParams = {
	reason?: string
	duration?: string
	repealed?: boolean
}

export type InfractionModifyRes = {
	infraction: Infraction
	success: boolean
	errors?: any
}

export type Infraction = {
	id: number
	player_id: string
	platform: string
	user_id?: string
	server_id: number
	type: string
	reason?: string
	duration?: Date
	system_action?: boolean
	created_at?: string
	modified_at?: string
	repealed?: boolean
	issuer_name?: string // not a DB field
	attachments?: Attachment[] // not a DB field
	linked_chat_messages?: ChatMessage[] // not a DB field
}
