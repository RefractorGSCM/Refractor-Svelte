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
