import Tooltip from "../components/TooltipFromAction.svelte"

export default function tooltip(element: HTMLElement, text: string) {
	let tooltipComponent

	function mouseOver(e) {
		if (tooltipComponent) tooltipComponent.$destroy()

		tooltipComponent = new Tooltip({
			props: {
				text,
				x: e.pageX + 10,
				y: e.pageY - 5,
			},
			target: document.body,
		})
	}

	function mouseMove(e) {
		tooltipComponent.$set({
			x: e.pageX + 10,
			y: e.pageY - 5,
		})
	}

	function mouseLeave() {
		tooltipComponent.$destroy()
	}

	element.addEventListener("mouseover", mouseOver)
	element.addEventListener("mouseleave", mouseLeave)
	element.addEventListener("mousemove", mouseMove)

	return {
		destroy() {
			element.removeEventListener("mouseover", mouseOver)
			element.removeEventListener("mouseleave", mouseLeave)
			element.removeEventListener("mousemove", mouseMove)
		},
	}
}
