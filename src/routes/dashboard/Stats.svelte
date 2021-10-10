<script>
	import Heading from "../../components/Heading.svelte"
	import { self } from "../../domain/auth/store"
	import Container from "./components/Container.svelte"

	function getTimeWord() {
		let currentHour = new Date().getHours()

		if (currentHour < 6 || currentHour > 20) {
			return "night"
		} else if (currentHour < 12) {
			return "morning"
		} else if (currentHour < 17) {
			return "afternoon"
		} else {
			return "evening"
		}

		return "day"
	}
</script>

<Container>
	<Heading type="subtitle">Good {getTimeWord()}, {$self.username}</Heading>
</Container>
