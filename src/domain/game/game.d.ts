type Game = {
	name: string
	platform: string
	chat_enabled?: boolean
	settings?: {
		player_infraction_threshold: number
	}
}

type GameCommandSettings = {
	create: {
		warn: GameCommand[]
		mute: GameCommand[]
		kick: GameCommand[]
		ban: GameCommand[]
	}
	update: {
		warn: GameCommand[]
		mute: GameCommand[]
		kick: GameCommand[]
		ban: GameCommand[]
	}
	delete: {
		warn: GameCommand[]
		mute: GameCommand[]
		kick: GameCommand[]
		ban: GameCommand[]
	}
	repeal: {
		warn: GameCommand[]
		mute: GameCommand[]
		kick: GameCommand[]
		ban: GameCommand[]
	}
	sync: {
		mute: GameCommand[]
		ban: GameCommand[]
	}
}

type GameGeneralSettings = {
	enable_ban_sync: boolean
	enable_mute_sync: boolean
	player_infraction_threshold: number
	player_infraction_timespan: number
}

type GameCommand = {
	command: string
	run_on_all: boolean
}

type GameSettings = {
	commands: GameCommandSettings
	general: GameGeneralSettings
}
