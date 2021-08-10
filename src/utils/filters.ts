export function filterEmptyStrings(obj) {
	for (const [key, val] of Object.entries(obj)) {
		if (typeof val !== "string") {
			continue
		}

		if (val.trim().length < 1) {
			delete obj[key]
		}
	}

	return obj
}
