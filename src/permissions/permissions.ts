export const FLAG_ADMINISTRATOR = "FLAG_ADMINISTRATOR"
export const FLAG_VIEW_SERVERS = "FLAG_VIEW_SERVERS"

const flags = {}
const descriptions = {}

type Flag = {
	name: string
	description: string
	flag?: BigInt
}

function registerFlags(newFlags: Flag[]) {
	let i = 0

	for (const flag of newFlags) {
		const next = 1 << i
		i++

		flags[flag.name] = next
		descriptions[flag.name] = flag.description
	}
}

registerFlags([
	// DO NOT CHANGE THE ORDER OF FLAGS. DOING SO WILL BREAK PERMISSIONS FOR ALL EXISTING INSTALLATIONS OF REFRACTOR.
	// If you need to add more flags, add them to the end ONLY.
	{
		name: FLAG_ADMINISTRATOR,
		description: `Grants full access to Refractor. Administrator is required to be able to add, edit and delete
						  servers as well as modify admin level settings. Only give this permission to people who
						  absolutely need it.`,
	},
	{
		name: FLAG_VIEW_SERVERS,
		description:
			"Allows the viewing of servers, their status and their online players.",
	},
	// ADD NEW FLAGS HERE
])

export function getFlag(name: string): BigInt {
	return flags[name]
}

export function getDescription(name: string): string {
	return descriptions[name]
}
