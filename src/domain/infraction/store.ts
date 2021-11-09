import type { AxiosResponse } from "axios"
import { errorToast, successToast } from "../../utils/toast"
import api from "./api"

type infractionCreator = (
	serverId: number,
	body: Object,
) => Promise<AxiosResponse>
type creationRes = {
	infraction: Infraction
	success: boolean
	errors?: any
}

async function createInfraction(
	creator: infractionCreator,
	serverId: number,
	body: Object,
): Promise<creationRes> {
	try {
		const { data } = await creator(serverId, body)

		return {
			infraction: data.payload as Infraction,
			success: true,
		}
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				infraction: null,
				success: false,
				errors: data.errors,
			}
		}

		return {
			infraction: null,
			success: false,
		}
	}
}

export async function createWarning(
	serverId: number,
	body: CreateWarningParams,
): Promise<creationRes> {
	const res = await createInfraction(api.createWarning, serverId, body)

	if (res.success) {
		successToast("Warning created")
		return res
	} else {
		errorToast("Could not create warning")
		return res
	}
}

export async function createMute(
	serverId: number,
	body: CreateMuteParams,
): Promise<creationRes> {
	const res = await createInfraction(api.createMute, serverId, body)

	if (res.success) {
		successToast("Mute created")
		return res
	} else {
		errorToast("Could not create mute")
		return res
	}
}

export async function createKick(
	serverId: number,
	body: CreateKickParams,
): Promise<creationRes> {
	const res = await createInfraction(api.createKick, serverId, body)

	if (res.success) {
		successToast("Kick created")
		return res
	} else {
		errorToast("Could not create kick")
		return res
	}
}

export async function createBan(
	serverId: number,
	body: CreateBanParams,
): Promise<creationRes> {
	const res = await createInfraction(api.createBan, serverId, body)

	if (res.success) {
		successToast("Ban created")
		return res
	} else {
		errorToast("Could not create ban")
		return res
	}
}

export async function getPlayerInfractions(
	platform: string,
	playerId: string,
): Promise<Infraction[]> {
	try {
		const { data } = await api.getPlayerInfractions(platform, playerId)

		return data.payload as Infraction[]
	} catch (err) {
		const { data } = err.response

		errorToast(data.message ? data.message : "Could not get player infractions")
	}
}

export async function getInfractionById(id: number): Promise<Infraction> {
	try {
		const { data } = await api.getInfractionById(id)

		return data.payload as Infraction
	} catch (err) {
		const { data } = err.response

		errorToast(data.message ? data.message : "Could not get infraction")
	}
}

export async function updateInfraction(
	id: number,
	fields: Object,
): Promise<creationRes> {
	try {
		const { data } = await api.updateInfraction(id, fields)

		return {
			infraction: data.payload as Infraction,
			success: true,
		}
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				infraction: null,
				success: false,
				errors: data.errors,
			}
		}

		return {
			infraction: null,
			success: false,
		}
	}
}

export async function setInfractionRepealed(
	id: number,
	isRepealed: boolean,
): Promise<creationRes> {
	try {
		const { data } = await api.setRepealed(id, isRepealed)

		return {
			infraction: data.payload as Infraction,
			success: true,
		}
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				infraction: null,
				success: false,
				errors: data.errors,
			}
		}

		return {
			infraction: null,
			success: false,
		}
	}
}

export async function deleteInfraction(id: number): Promise<boolean> {
	try {
		await api.deleteInfraction(id)

		successToast("Infraction deleted")

		return true
	} catch (err) {
		errorToast("Could not delete infraction")

		return false
	}
}
