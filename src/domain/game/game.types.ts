export type Game = {
	name: string
	platform: string
	chat_enabled?: boolean
}

export type GameSettings = {
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
}
