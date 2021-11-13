type Player = {
	id: string
	platform: string
	name?: string
	watched?: boolean
	last_seen?: Date
	previous_names?: string[]
	created_at?: Date
	modified_at?: Date
	infraction_count?: number // not a db field
	infraction_count_since_timespan?: number // not a db field
}
