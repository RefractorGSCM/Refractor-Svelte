type Self = {
	id: string
	username: string
	permissions: string | number | bigint
	groups: Group[]
	meta?: any
}
