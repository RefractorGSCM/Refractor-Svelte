import { errorToast, successToast } from "../../utils/toast"
import api from "./api"
import type { Attachment, CreateAttachmentParams } from "./attachment.types"

type createAttachmentRes = {
	attachment: Attachment
	success: boolean
	errors?: any
}

export async function createAttachment(
	infractionID: number,
	body: CreateAttachmentParams,
): Promise<createAttachmentRes> {
	try {
		const { data } = await api.addAttachment(infractionID, body)

		successToast("Attachment added")

		return {
			attachment: data.payload as Attachment,
			success: true,
		}
	} catch (err) {
		const { data } = err.response

		errorToast(
			data.message ? `Error: ${data.message}` : "Could not add attachment",
		)

		return {
			attachment: null,
			success: false,
			errors: data.errors,
		}
	}
}

export async function deleteAttachment(attachmentID: number) {
	try {
		await api.removeAttachment(attachmentID)
	} catch (err) {
		const { data } = err.response

		errorToast(
			data.message ? `Error: ${data.message}` : "Could not add attachment",
		)
	}
}
