import type { StringSchema } from "yup"
import type { Player } from "../player/player.types"

export type Server = {
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

export type CreateServerParams = {
	game: string
	name: string
	address: string
	rcon_port: string
	rcon_password: string
}

export type UpdateServerParams = {
	game?: string
	name?: string
	address?: string
	rcon_port?: string
	rcon_password?: string
}
