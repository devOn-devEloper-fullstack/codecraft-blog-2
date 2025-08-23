<script lang="ts">
	import type { TableState } from '../state/tableState.svelte.ts';
	let { state }: { state: TableState<any> } = $props();

	function onSort(key: string, multi = false) {
		state.toggleSort(key as any, multi);
	}
	function sortDir(key: string) {
		const s = state.sort.find((r) => r.key === key);
		return s?.dir ?? '';
	}
</script>

<div role="rowgroup" class="dt-thead">
	<div
		role="row"
		class="dt-tr"
		style={`grid-template-columns: ${state.columns.map((c) => c.width || '1fr').join(' ')}`}
	>
		{#each state.columns as col}
			<div
				role="columnheader"
				class="dt-th"
				style:width={col.width}
				onclick={(e) => onSort(col.key, e.shiftKey)}
			>
				<button class="dt-th-btn" type="button" aria-label={`Sort by ${col.header}`}>
					{col.header}
					{#if sortDir(col.key)}
						<span class="dt-sort">{sortDir(col.key)}</span>
					{/if}
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.dt-thead {
		background: var(--muted, #f9fafb);
	}
	.dt-tr {
		display: grid;
	}
	.dt-th {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}
	.dt-th-btn {
		display: inline-flex;
		gap: 0.25rem;
		align-items: center;
		background: none;
		border: 0;
		cursor: pointer;
		font: inherit;
	}
	.dt-sort {
		font-size: 0.75rem;
		opacity: 0.7;
		text-transform: uppercase;
	}
</style>
