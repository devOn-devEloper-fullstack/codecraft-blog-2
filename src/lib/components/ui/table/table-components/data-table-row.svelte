<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import DataTableCell from './data-table-cell.svelte';

	interface Column {
		key: string;
		width?: string;
		render?: (row: T) => any;
	}

	interface Props<T> {
		state: any;
		item: T;
		index: number;
		/** Per-column cell content map: key -> (row, index) */
		cell?: Record<string, Snippet<[T, number]>>;
	}

	let { state, item, index, cell }: Props<T> = $props();
</script>

<div
	role="row"
	class="dt-tr"
	style={`grid-template-columns: ${state.columns.map((c: Column) => c.width || '1fr').join(' ')}`}
>
	{#each state.columns as col}
		<DataTableCell value={col} rowData={item} {index} render={cell ? cell[col.key] : undefined} />
	{/each}
</div>
