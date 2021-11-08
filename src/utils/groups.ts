import { baseGroup } from "../domain/group/store"
import { decimalToHex, hexToDecimal } from "./color"
import { sortAsc } from "./sorting"

export function getTopGroup(groups: Group[]): Group {
	if (!groups || groups.length === 0) {
		// return base group if no other groups were found
		return baseGroup
	}

	const sorted = sortAsc("position", groups)

	return sorted[0]
}
