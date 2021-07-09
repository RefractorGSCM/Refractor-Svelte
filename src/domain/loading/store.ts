import { writable } from "svelte/store"

export const loading = writable({})

export function setLoading(scope: string, isLoading: boolean) {
	loading.set({
		...loading,
		[scope]: isLoading,
	})
}
