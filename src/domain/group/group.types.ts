export type Group = {
	id?: number
	name: string
	color: number
	position: number
	permissions: bigint
	created_at?: Date
	modified_at?: Date
	displayColor?: string // not a server field, just used for editing
}

export type NewGroupParams = {
	name: string
	color: number
	position: number
	permissions: string
}

export type Permission = {
	name: string
	description?: string
	flag: string
}
