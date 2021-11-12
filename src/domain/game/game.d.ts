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
}

type GameSettings = {
	commands: GameCommandSettings
	general: GameGeneralSettings
}
