export type CreateWarningParams = {
	reason?: string
	platform?: string
	playerId?: string
}

export type CreateMuteParams = {
	reason?: string
	duration?: number
	platform?: string
	playerId?: string
}

export type CreateKickParams = {
	reason?: string
	platform?: string
	playerId?: string
}

export type CreateBanParams = {
	reason?: string
	duration?: number
	platform?: string
	playerId?: string
}

export type UpdateInfractionParams = {
	reason?: string
	duration?: string
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
	created_at?: Date
	modified_at?: Date
}
