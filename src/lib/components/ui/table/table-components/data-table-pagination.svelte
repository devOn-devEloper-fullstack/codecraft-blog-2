<script lang="ts">
	import type { TableState } from '../state/tableState.svelte.ts';
	let { state }: { state: TableState<any> } = $props();
</script>

<div class="dt-pagination" role="navigation" aria-label="Pagination">
	<button
		type="button"
		onclick={() => state.setPageIndex(0)}
		disabled={state.pagination.pageIndex === 0}>« First</button
	>
	<button
		type="button"
		onclick={() => state.setPageIndex(state.pagination.pageIndex - 1)}
		disabled={state.pagination.pageIndex === 0}>‹ Prev</button
	>
	<span>Page {state.pagination.pageIndex + 1} of {state.pageTotal}</span>
	<button
		type="button"
		onclick={() => state.setPageIndex(state.pagination.pageIndex + 1)}
		disabled={state.pagination.pageIndex >= state.pageTotal - 1}>Next ›</button
	>
	<button
		type="button"
		onclick={() => state.setPageIndex(state.pageTotal - 1)}
		disabled={state.pagination.pageIndex >= state.pageTotal - 1}>Last »</button
	>
	<label>
		<span class="sr-only">Rows per page</span>
		<select
			bind:value={state.pagination.pageSize}
			oninput={(e) => state.setPageSize(Number((e.target as HTMLSelectElement).value))}
		>
			<option>5</option><option>10</option><option>20</option><option>50</option>
		</select>
	</label>
</div>

<style>
	.dt-pagination {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: space-between;
	}
	button,
	select {
		padding: 0.35rem 0.6rem;
		border: 1px solid #e5e7eb;
		background: white;
		border-radius: 0.375rem;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
