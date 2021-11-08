type UserMeta = {
	deactivated: boolean
}

type User = {
	id: string
	username: string
	permissions: string | number | bigint
	groups: Group[]
	meta: UserMeta
}

type UserTraits = {
	email: string
	username: string
}

type UserLinkParams = {
	player_id: string
	platform: string
	user_id: string
}
