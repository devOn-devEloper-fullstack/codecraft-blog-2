<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { TableState } from '../state/tableState.svelte.ts';

	interface Props {
		state: TableState<T>;
		toolbar?: Snippet; // was slot="toolbar"
		header?: Snippet; // was slot="header"
		body?: Snippet; // was slot="body"
		pagination?: Snippet; // was slot="pagination"
		children?: Snippet; // optional implicit content
	}

	let { state, toolbar, header, body, pagination, children }: Props = $props();
</script>

<div class="dt-root" role="region" aria-label="Data table">
	{@render toolbar?.()}
	<div class="dt-table" role="table">
		{@render header?.()}
		{@render body?.()}
		{@render children?.()}
	</div>
	{@render pagination?.()}
</div>

<style>
	.dt-root {
		display: grid;
		gap: 0.75rem;
	}
	.dt-table {
		border: 1px solid var(--border, #e5e7eb);
		border-radius: 0.5rem;
		overflow: hidden;
	}
</style>
