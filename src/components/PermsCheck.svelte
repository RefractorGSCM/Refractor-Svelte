<script lang="ts">
	import { self } from "../domain/auth/store"

	import {
		checkFlag,
		FLAG_ADMINISTRATOR,
		FLAG_SUPER_ADMIN,
		getAllFlags,
		getFlag,
	} from "../permissions/permissions"

	type comparators = {
		hasFlag: (flag: string) => boolean
	}

	export let checker: (permissions: bigint, cmp: comparators) => boolean
	export let adminBypass: boolean = true

	let show = false

	let skip = false
	if (
		checkFlag($self.permissions, getFlag(FLAG_SUPER_ADMIN)) ||
		(adminBypass && checkFlag($self.permissions, getFlag(FLAG_ADMINISTRATOR)))
	) {
		skip = true
		show = true
	}

	if (!skip) {
		const comps = {
			hasFlag: (flag: string): boolean => {
				return checkFlag($self.permissions, getFlag(flag))
			},
		}

		show = checker(BigInt($self.permissions), comps)
	}
</script>

{#if show}
	<slot />
{/if}
