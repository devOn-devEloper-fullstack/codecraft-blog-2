<script lang="ts" generics="T extends Record<string, unknown>">
	import type { GroupNode } from '../utils/group.svelte.ts';
	import type { TableState } from '../state/tableState.svelte.ts';
	import type { Snippet } from 'svelte';
	import DataTableRow from './data-table-row.svelte';
	import GroupBlock from './group-block.svelte';

	// Note: recursive components should use <svelte:self /> in Svelte 5
	let {
		group,
		state,
		cell,
		row
	}: {
		group: GroupNode<T>;
		state: TableState<T>;
		cell?: Record<string, Snippet<[T, number]>>;
		/** Optional row snippet override */
		row?: Snippet<[T, number]>;
	} = $props();
</script>

<div class="dt-group">
	<button
		class="dt-group-toggle"
		type="button"
		onclick={() => state.toggleCollapsed(group.path)}
		aria-expanded={!state.isCollapsed(group.path)}
	>
		{state.isCollapsed(group.path) ? '▶' : '▼'}
		{group.label}
	</button>
	{#if !state.isCollapsed(group.path)}
		{#if group.children}
			{#each group.children as child}
				<GroupBlock {group} {state} {cell} {row} />
			{/each}
		{:else if group.rows}
			{#each group.rows as rowData, i}
				{#if row}
					{@render row(rowData, i)}
				{:else}
					<DataTableRow {state} {rowData} index={i} {cell} />
				{/if}
			{/each}
		{/if}
	{/if}
</div>

<style>
	.dt-group {
		border-top: 1px solid #e5e7eb;
	}
	.dt-group-toggle {
		width: 100%;
		text-align: left;
		padding: 0.5rem 0.75rem;
		background: #f3f4f6;
		border: none;
		cursor: pointer;
	}
</style>
