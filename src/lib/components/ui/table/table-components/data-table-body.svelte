<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import GroupBlock from './group-block.svelte';

	interface Props<T> {
		state: any;
		/** Optional row renderer: (row, index) */
		row?: Snippet<[T, number]>;
		/** Optional per-column cell renderers: key -> (row, index) */
		cells?: Record<string, Snippet<[T, number]>>;
	}

	let { state, row, cells = {} as Record<string, Snippet<[T, number]>> }: Props<T> = $props();

	function renderCell(colKey: string, rowData: T, i: number) {
		const s = cells[colKey];
		if (s) return s(rowData, i);
		const col = state.columns.find((c: any) => c.key === colKey);
		return col?.render ? col.render(rowData) : (rowData as any)[colKey];
	}
</script>

<div role="rowgroup" class="dt-tbody">
	{#if state.total === 0}
		<div class="dt-empty">No results</div>
	{:else if state.grouping && state.grouped}
		{#each state.grouped as group}
			<GroupBlock {group} {state} {row} cell={cells} />
		{/each}
	{:else}
		{#each state.pageRows as r, i}
			{#if row}
				{@render row(r, i)}
			{:else}
				<div
					role="row"
					class="dt-tr"
					style={`grid-template-columns: ${state.columns.map((c: any) => c.width || '1fr').join(' ')}`}
				>
					{#each state.columns as col}
						<div role="cell" class="dt-td">{renderCell(col.key, r, i)}</div>
					{/each}
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.dt-tr {
		display: grid;
	}
	.dt-td {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #f3f4f6;
	}
	.dt-empty {
		padding: 1rem;
		color: #6b7280;
	}
</style>
