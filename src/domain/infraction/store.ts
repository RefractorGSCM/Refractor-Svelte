import type { AxiosResponse } from "axios"
import { errorToast, successToast } from "../../utils/toast"
import api from "./api"
import type {
	CreateBanParams,
	CreateKickParams,
	CreateMuteParams,
	CreateWarningParams,
	Infraction,
} from "./infraction.types"

type infractionCreator = (
	serverId: number,
	body: Object,
) => Promise<AxiosResponse>
type creationRes = {
	infraction: Infraction
	success: boolean
	err?: any
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
				err: data.errors,
			}
		}

		return {
			infraction: null,
			success: false,
			err: data.message || "Could not create infraction",
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
		errorToast(
			typeof res.err == "string" ? res.err : "Could not create warning",
		)
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
		errorToast(typeof res.err == "string" ? res.err : "Could not create mute")
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
		errorToast(typeof res.err == "string" ? res.err : "Could not create kick")
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
		errorToast(typeof res.err == "string" ? res.err : "Could not create ban")
		return res
	}
}
