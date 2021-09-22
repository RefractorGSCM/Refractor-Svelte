import { errorToast, successToast } from "../../utils/toast"
import api from "./api"
import type {
	InfractionSearchBody,
	InfractionSearchResults,
	PlayerSearchBody,
	PlayerSearchResults,
} from "./search.types"

export async function searchPlayers(
	body: PlayerSearchBody,
): Promise<PlayerSearchResults> {
	try {
		const { data } = await api.searchPlayers(body)

		return data.payload as PlayerSearchResults
	} catch (err) {
		errorToast("Could not run player search")
	}
}

type infractionSearchRes = {
	results: InfractionSearchResults
	success: boolean
	errors?: object
}

export async function searchInfractions(
	body: InfractionSearchBody,
): Promise<infractionSearchRes> {
	try {
		const { data } = await api.searchInfractions(body)

		return {
			results: data.payload as InfractionSearchResults,
			success: true,
		}
	} catch (err) {
		const { data } = err.response

		if (data.errors) {
			return {
				results: null,
				success: false,
				errors: data.errors,
			}
		}

		return {
			results: null,
			success: false,
		}
	}
}
