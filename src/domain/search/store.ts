import { errorToast } from "../../utils/toast"
import api from "./api"
import type { PlayerSearchBody, PlayerSearchResults } from "./search.types"

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
