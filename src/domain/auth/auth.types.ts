import type { Group } from "../group/group.types"

export type Self = {
	id: string
	username: string
	permissions: string | number | bigint
	groups: Group[]
	meta?: any
}
