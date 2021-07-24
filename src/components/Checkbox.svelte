<script lang="ts">
	export let name: string
	export let label: string = ""
</script>

<div class="checkbox-wrapper">
	<input id={`cb-id-${name}`} type="checkbox" {name} />
	<label for={`cb-id-${name}`}>{label}</label>
</div>

<style lang="scss">
	.checkbox-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;

		label {
			cursor: pointer;
			user-select: none;
			display: flex;
			justify-content: space-between;
			flex: 1;
		}

		input[type="checkbox"] {
			cursor: pointer;
			opacity: 0;
			position: absolute;
		}

		label::after {
			content: "";
			width: 2rem;
			height: 2rem;
			border: 1px solid var(--color-text-muted2);
			border-radius: 1px;
		}

		label:hover::after,
		input[type="checkbox"]:hover + label::after {
			background-color: var(--color-topbar);
		}

		input[type="checkbox"]:focus + label::after {
			outline: 1px solid var(--color-primary);
		}

		input[type="checkbox"]:checked + label::after {
			content: "\002713";
			background-color: var(--color-accent);
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid var(--color-primary);
		}
	}
</style>
