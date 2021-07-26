// @ts-nocheck
import { toast } from "@zerodevx/svelte-toast"

export function infoToast(msg: string) {
	toast.push(msg)
}

export function successToast(msg: string) {
	toast.push(msg, {
		theme: {
			"--toastBackground": "var(--color-success-dark)",
		},
	})
}

export function errorToast(msg: string) {
	toast.push(msg, {
		theme: {
			"--toastBackground": "var(--color-danger)",
		},
	})
}
