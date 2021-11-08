type Attachment = {
	id?: number
	infraction_id?: number
	url: string
	note: string
}

type CreateAttachmentParams = {
	url: string
	note: string
}
