type Game = {
	name: string
	platform: string
	chat_enabled?: boolean
}

type GameCommandSettings = {
	create: {
		warn: string[]
		mute: string[]
		kick: string[]
		ban: string[]
	}
	update: {
		warn: string[]
		mute: string[]
		kick: string[]
		ban: string[]
	}
	delete: {
		warn: string[]
		mute: string[]
		kick: string[]
		ban: string[]
	}
	repeal: {
		warn: string[]
		mute: string[]
		kick: string[]
		ban: string[]
	}
	sync: {
		mute: string[]
		ban: string[]
	}
}

type GameGeneralSettings = {
	enable_ban_sync: boolean
	player_infraction_threshold: number
	player_infraction_timespan: number
}

type GameSettings = {
	commands: GameCommandSettings
	general: GameGeneralSettings
}
