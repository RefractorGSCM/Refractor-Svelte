export type Group = {
	id?: number
	name: string
	color: number | string
	position: number
	permissions: bigint
	created_at?: Date
	modified_at?: Date
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
