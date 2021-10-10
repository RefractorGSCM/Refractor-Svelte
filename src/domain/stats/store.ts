import { errorToast } from "../../utils/toast"
import api from "./api"
import type { Stats } from "./stats.types"

export async function getStats(): Promise<Stats> {
	try {
		const { data } = await api.getStats()

		return data.payload as Stats
	} catch (err) {
		console.error(err)
		errorToast("Could not get stats")
	}
}
