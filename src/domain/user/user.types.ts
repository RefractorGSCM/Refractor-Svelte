import type { Group } from "../group/group.types"

export type UserMeta = {
	deactivated: boolean
}

export type User = {
	id: string
	username: string
	permissions: string | number | bigint
	groups: Group[]
	meta: UserMeta
}

export type UserTraits = {
	email: string
	username: string
}

export type UserLinkParams = {
	player_id: string
	platform: string
	user_id: string
}
