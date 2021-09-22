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

export function filterUndefined(obj) {
	for (const [key, val] of Object.entries(obj)) {
		if (val === undefined) {
			delete obj[key]
		}
	}

	return obj
}

export function filterZero(obj) {
	for (const [key, val] of Object.entries(obj)) {
		if (val === 0) {
			delete obj[key]
		}
	}

	return obj
}

export function filterEmpty(obj) {
	obj = filterEmptyStrings(obj)
	obj = filterUndefined(obj)

	return obj
}
