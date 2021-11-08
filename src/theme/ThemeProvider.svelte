<script lang="ts">
	import { currentTheme } from "./store"
	import dark from "./themes/dark"

	const themes = {
		dark,
	}

	let currentThemeName = localStorage.getItem("theme") || "dark"

	if (!themes[currentThemeName]) {
		currentThemeName = "dark"
	}

	const theme = themes[currentThemeName] as Theme
	currentTheme.set(theme)

	// Set color css variables
	for (const colorKey in theme.colors) {
		// Convery camelCase keys to dash case/kebab case
		const dashedKey = colorKey.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())

		document.body.style.setProperty(
			`--color-${dashedKey}`,
			theme.colors[colorKey],
		)
	}

	// Set border css variables
	for (const borderKey in theme.borders) {
		// Convery camelCase keys to dash case/kebab case
		const dashedKey = borderKey.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())

		document.body.style.setProperty(
			`--border-${dashedKey}`,
			theme.borders[borderKey],
		)
	}
</script>

<svelte:head>
	<style>
		body {
			background-color: var(--color-background3);
			color: var(--color-text1);
		}
	</style>
</svelte:head>
