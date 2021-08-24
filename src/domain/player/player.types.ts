export type Player = {
	id: string
	platform: string
	name?: string
	watched?: boolean
	last_seen?: Date
	previous_names?: string[]
	created_at?: Date
	modified_at?: Date
}
