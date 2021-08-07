import type { StringSchema } from "yup"

export type Server = {
	id: number
	game: string
	name: string
	address: string
	created_at?: any
	modified_at?: any
}

export type CreateServerParams = {
	game: string
	name: string
	address: string
	rcon_port: string
	rcon_password: string
}
