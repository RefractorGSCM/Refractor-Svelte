import type { Group } from "../domain/group/group.types"
import { sortAsc } from "./sorting"

export function getTopGroup(groups: Group[]): Group {
	const sorted = sortAsc("position", groups)

	return sorted[0]
}
