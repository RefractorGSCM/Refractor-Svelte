export type Attachment = {
	id?: number
	infraction_id?: number
	url: string
	note: string
}

export type CreateAttachmentParams = {
	url: string
	note: string
}
