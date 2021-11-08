type Server = {
	id: number
	game: string
	name: string
	address: string
	created_at?: any
	modified_at?: any
	is_fragment?: boolean
	status?: string
	online_players?: Player[]
}

type CreateServerParams = {
	game: string
	name: string
	address: string
	rcon_port: string
	rcon_password: string
}

type UpdateServerParams = {
	game?: string
	name?: string
	address?: string
	rcon_port?: string
	rcon_password?: string
}
