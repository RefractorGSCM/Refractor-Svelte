import type { Attachment } from "../attachment/attachment.types"

export type CreateWarningParams = {
	reason?: string
	platform?: string
	player_id?: string
	attachments?: Attachment[]
}

export type CreateMuteParams = {
	reason?: string
	duration?: number
	platform?: string
	player_id?: string
	attachments?: Attachment[]
}

export type CreateKickParams = {
	reason?: string
	platform?: string
	player_id?: string
	attachments?: Attachment[]
}

export type CreateBanParams = {
	reason?: string
	duration?: number
	platform?: string
	player_id?: string
	attachments?: Attachment[]
}

export type UpdateInfractionParams = {
	reason?: string
	duration?: string
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
	issuer_name?: string // not a DB field
	attachments?: Attachment[] // not a DB field
}
