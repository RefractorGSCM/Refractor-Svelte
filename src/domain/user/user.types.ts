import type { Group } from "../group/group.types"

export type User = {
	id: string
	username: string
	permissions: string | number | bigint
	groups: Group[]
}

export type UserTraits = {
	email: string
	username: string
}
