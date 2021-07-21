// Sourced from https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
// Thanks :)

type HSLOpts = {
	hue?: [number, number]
	sat?: [number, number]
	lit?: [number, number]
}

export function stringToHSL(str: string, opts: HSLOpts): string {
	if (str.length === 0) {
		return "hsl(0, 0%, 0%)"
	}

	let h, s, l
	opts = opts || {}
	opts.hue = opts.hue || [0, 360]
	opts.sat = opts.sat || [75, 100]
	opts.lit = opts.lit || [40, 60]

	let range = function (hash, min, max) {
		let diff = max - min
		let x = ((hash % diff) + diff) % diff
		return x + min
	}

	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
		hash = hash & hash
	}

	h = range(hash, opts.hue[0], opts.hue[1])
	s = range(hash, opts.sat[0], opts.sat[1])
	l = range(hash, opts.lit[0], opts.lit[1])

	return `hsl(${h}, ${s}%, ${l}%)`
}

export function decimalToHex(dec: number): string {
	var hex = dec.toString(16)
	const padding = 6

	while (hex.length < padding) {
		hex = "0" + hex
	}

	return hex
}

export function hexToDecimal(hex: string): number {
	return parseInt(hex, 16)
}

export function rgbToHex(
	r: number | string,
	g: number | string,
	b: number | string,
): string {
	r = r.toString(16)
	g = g.toString(16)
	b = b.toString(16)

	if (r.length == 1) r = "0" + r
	if (g.length == 1) g = "0" + g
	if (b.length == 1) b = "0" + b

	return r + g + b
}
