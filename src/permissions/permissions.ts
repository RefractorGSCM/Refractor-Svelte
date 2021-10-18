import { sortAsc } from "../utils/sorting"

export const FLAG_SUPER_ADMIN = "FLAG_SUPER_ADMIN"
export const FLAG_ADMINISTRATOR = "FLAG_ADMINISTRATOR"
export const FLAG_VIEW_SERVERS = "FLAG_VIEW_SERVERS"
export const FLAG_VIEW_PLAYER_RECORDS = "FLAG_VIEW_PLAYER_RECORDS"
export const FLAG_VIEW_INFRACTION_RECORDS = "FLAG_VIEW_INFRACTION_RECORDS"
export const FLAG_VIEW_CHAT_RECORDS = "FLAG_VIEW_CHAT_RECORDS"
export const FLAG_CREATE_WARNING = "FLAG_CREATE_WARNING"
export const FLAG_CREATE_MUTE = "FLAG_CREATE_MUTE"
export const FLAG_CREATE_KICK = "FLAG_CREATE_KICK"
export const FLAG_CREATE_BAN = "FLAG_CREATE_BAN"
export const FLAG_EDIT_OWN_INFRACTIONS = "FLAG_EDIT_OWN_INFRACTIONS"
export const FLAG_EDIT_ANY_INFRACTIONS = "FLAG_EDIT_ANY_INFRACTIONS"
export const FLAG_DELETE_OWN_INFRACTIONS = "FLAG_DELETE_OWN_INFRACTIONS"
export const FLAG_DELETE_ANY_INFRACTIONS = "FLAG_DELETE_ANY_INFRACTIONS"
export const FLAG_READ_LIVE_CHAT = "FLAG_READ_LIVE_CHAT"
export const FLAG_SEND_LIVE_CHAT = "FLAG_SEND_LIVE_CHAT"
export const FLAG_MODERATE_FLAGGED_MESSAGES = "FLAG_MODERATE_FLAGGED_MESSAGES"

const allFlags: string[] = []
const permissions = {}

type Permission = {
	id?: number
	name: string
	display_name: string
	description: string
	flag?: bigint
	scope: string
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
			id: perm.id,
			name: perm.name,
			display_name: perm.display_name,
			description: perm.description,
			flag: BigInt(perm.flag),
			scope: perm.scope,
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

	// Return true if the user is a super admin
	const superAdminFlag = getFlag(FLAG_SUPER_ADMIN)
	if ((permissions & superAdminFlag) === superAdminFlag) {
		return true
	}

	return false
}

export function getAllFlags(): string[] {
	return allFlags
}

export function getAllPermissions(): Permission[] {
	const permissionsArr: Permission[] = []

	for (const key of Object.keys(permissions)) {
		permissionsArr.push(permissions[key])
	}

	return permissionsArr
}

export function hasAllOf(
	perms: BigInt,
	adminBypass: boolean,
	...flagNames: string[]
): boolean {
	const flags: BigInt[] = []
	let hasPermission = false

	for (const f of flagNames) {
		const flag = getFlag(f)

		if (!checkFlag(perms, flag)) {
			hasPermission = false
			break
		}
	}

	// Check for admin bypass
	if (
		!hasPermission &&
		adminBypass &&
		checkFlag(perms, getFlag(FLAG_ADMINISTRATOR))
	) {
		return true
	}

	// Check if user is super admin
	if (checkFlag(perms, getFlag(FLAG_SUPER_ADMIN))) {
		return true
	}

	return hasPermission
}

export function hasOneOf(
	perms: BigInt,
	adminBypass: boolean,
	...flagNames: string[]
): boolean {
	const flags: BigInt[] = []
	let hasPermission = false

	for (const f of flagNames) {
		const flag = getFlag(f)

		if (checkFlag(perms, flag)) {
			hasPermission = true
			break
		}
	}

	// Check for admin bypass
	if (
		!hasPermission &&
		adminBypass &&
		checkFlag(perms, getFlag(FLAG_ADMINISTRATOR))
	) {
		return true
	}

	// Check if user is super admin
	if (!hasPermission && checkFlag(perms, getFlag(FLAG_SUPER_ADMIN))) {
		return true
	}

	return hasPermission
}
