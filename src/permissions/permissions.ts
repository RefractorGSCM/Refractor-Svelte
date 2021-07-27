import { sortAsc } from "../utils/sorting"

export const FLAG_SUPER_ADMIN = "FLAG_SUPER_ADMIN"
export const FLAG_ADMINISTRATOR = "FLAG_ADMINISTRATOR"
export const FLAG_VIEW_SERVERS = "FLAG_VIEW_SERVERS"

const allFlags: string[] = []
const permissions = {}

type Permission = {
	id?: number
	name: string
	description: string
	flag?: bigint
}

export function registerPermissions(newPerms: Permission[]) {
	// JSON maintains the order of array elements through transmissions, but we do an additional sort to make sure that the array
	// is sorted by the ID field (which represents the order in which a permission had it's flag assigned).
	newPerms = sortAsc("id", newPerms)

	let i = 0

	for (const perm of newPerms) {
		const next = 1 << i
		i++

		permissions[perm.name] = {
			name: perm.name,
			description: perm.description,
			flag: BigInt(perm.flag),
		}
		allFlags.push(perm.name)
	}
}

export function getFlag(name: string): bigint {
	return BigInt(permissions[name].flag)
}

export function getDescription(name: string): string {
	return permissions[name].description
}

export function getSetFlags(permissions: bigint): string[] {
	const setFlags: string[] = []
	permissions = BigInt(permissions)

	if (permissions === BigInt(0)) {
		return setFlags
	}

	for (const flagName of allFlags) {
		const flag = getFlag(flagName)

		if ((permissions & flag) === flag) {
			setFlags.push(flagName)
		}
	}

	return setFlags
}

export function checkFlag(permissions, flag): boolean {
	permissions = BigInt(permissions)
	flag = BigInt(flag)

	if ((permissions & flag) === flag) {
		return true
	}

	return false
}
