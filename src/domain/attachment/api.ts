import axios from "axios"
import type { CreateAttachmentParams } from "./attachment.types"

const addAttachment = (infractionID: number, body: CreateAttachmentParams) => {
	return axios.post(
		`${import.meta.env.VITE_API_ROOT}/infractions/${infractionID}/attachment`,
		body,
		{ withCredentials: true },
	)
}

const removeAttachment = (attachmentID: number) => {
	return axios.delete(
		`${import.meta.env.VITE_API_ROOT}/infractions/attachment/${attachmentID}`,
		{
			withCredentials: true,
		},
	)
}

export default {
	addAttachment,
	removeAttachment,
}
