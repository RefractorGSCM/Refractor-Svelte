<script lang="ts">
	export let name: string
	export let label: string = ""
	export let checked: boolean = false
	export let disabled: boolean = false
</script>

<div class="checkbox-wrapper">
	<input
		id={`cb-id-${name}`}
		type="checkbox"
		{name}
		{checked}
		on:change
		{disabled}
	/>
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
			border: 1px solid var(--color-accent);
			border-radius: 2px;
			color: var(--color-text-muted2);
		}

		label:hover::after,
		input[type="checkbox"]:hover + label::after {
			background: none;
		}

		input[type="checkbox"]:focus + label::after {
			outline: 1px solid var(--color-primary);
			color: var(--color-accent);
		}

		input[type="checkbox"]:checked + label::after {
			content: "\002713";
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid var(--color-primary);
			color: var(--color-primary-light);
		}

		input[type="checkbox"]:checked:disabled + label::after {
			border: 1px solid var(--color-accent);
			color: var(--color-accent);
		}

		input[type="checkbox"]:disabled + label::after {
			background-color: var(--color-disabled-dark);
			border: 1px solid var(--color-disabled);
		}
	}
</style>
