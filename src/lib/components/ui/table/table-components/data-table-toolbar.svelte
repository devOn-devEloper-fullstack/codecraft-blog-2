<script lang="ts">
	import type { TableState } from '../state/tableState.svelte.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		state: TableState<any>;
		children?: Snippet;
	}
	let { state, children }: Props = $props();
</script>

<div class="dt-toolbar" role="toolbar" aria-label="Table tools">
	<input
		type="search"
		placeholder="Search..."
		value={state.globalQuery}
		oninput={(e) => state.setGlobalQuery((e.target as HTMLInputElement).value)}
		aria-label="Global search"
	/>
	{@render children?.()}
</div>

<style>
	.dt-toolbar {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	input[type='search'] {
		padding: 0.5rem 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
	}
</style>
