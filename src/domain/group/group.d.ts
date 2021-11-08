type Group = {
	id?: number
	name: string
	color: number
	position: number
	permissions: bigint
	created_at?: Date
	modified_at?: Date
	displayColor?: string // not a server field, just used for editing
}

type NewGroupParams = {
	name: string
	color: number
	position: number
	permissions: string
}

type Permission = {
	name: string
	description?: string
	flag: string
	scope: string
}

type GroupReorderInfo = {
	id: number
	pos: number
}

type ServerOverrides = {
	group_id: number
	deny_overrides: string
	allow_overrides: string
}
