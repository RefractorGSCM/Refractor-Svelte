<script lang="ts">
	import {
		checkFlag,
		FLAG_ADMINISTRATOR,
		FLAG_SUPER_ADMIN,
		getFlag,
	} from "../permissions/permissions"

	export let permissions: BigInt
	export let oneOf: string[] = []
	export let allOf: string[] = []
	export let adminBypass: boolean = true

	const needOneOf = oneOf.length > 0
	const needAllOf = allOf.length > 0

	let oneOfSatisfied = false
	if (!needOneOf) {
		oneOfSatisfied = true
	}

	let allOfSatisfied = false
	if (!needAllOf) {
		allOfSatisfied = true
	}

	if (permissions) {
		// Check if the user is an admin or super admin. If they are, satisfy permission requirements without check
		if (
			checkFlag(permissions, getFlag(FLAG_SUPER_ADMIN)) ||
			(adminBypass && checkFlag(permissions, getFlag(FLAG_ADMINISTRATOR)))
		) {
			oneOfSatisfied = true
			allOfSatisfied = true
		}

		// Check one of perms
		if (!oneOfSatisfied) {
			for (const flagName of oneOf) {
				const flag = getFlag(flagName)

				if (checkFlag(permissions, flag)) {
					oneOfSatisfied = true
					break
				}
			}
		}

		// Check all of perms
		if (!allOfSatisfied) {
			let satisfied = true

			for (const flagName of allOf) {
				const flag = getFlag(flagName)

				if (!checkFlag(permissions, flag)) {
					satisfied = false
					break
				}
			}

			allOfSatisfied = satisfied
		}
	}

	let show = oneOfSatisfied && allOfSatisfied
</script>

{#if show}
	<slot />
{/if}
