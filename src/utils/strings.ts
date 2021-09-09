export function truncate(value: string, limit: number): string {
	if (value.length <= limit) {
		return value
	}

	return value.substring(0, limit - 3) + "..."
}
