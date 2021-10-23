<script lang="ts">
	import TextInput from "./TextInput.svelte"

	export let name
	export let label = name
	export let required = false
	export let value = ""
	export let error = undefined

	function onKeyDown(e) {
		var regex = /[0-9]|\./
		if (
			!regex.test(e.key) &&
			e.key !== "Backspace" &&
			e.key !== "Tab" &&
			!(e.keyCode == 65 && e.ctrlKey === true) && // CTRL+A
			!(e.ctrlKey == true && (e.which == "118" || e.which == "86")) && // CTRL+V
			!(e.ctrlKey == true && (e.which == "99" || e.which == "67")) && // CTRL+C
			!(e.ctrlKey == true && (e.which == "120" || e.which == "88")) // CTRL+X
		) {
			if (e.preventDefault) e.preventDefault()
		}
	}
</script>

<TextInput
	{name}
	{label}
	{required}
	bind:value
	on:change
	on:blur
	on:focus
	on:input
	on:keyup
	on:keydown={onKeyDown}
/>
