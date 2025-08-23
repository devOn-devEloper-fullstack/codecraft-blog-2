<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	interface Props<T> {
		value: any;
		rowData: T;
		index: number;
		render?: Snippet<[T, number]>;
	}
	let { value, rowData, index, render }: Props<T> = $props();
</script>

<div role="cell" class="dt-td">
	{#if render}
		{@render render(rowData, index)}
	{:else}
		{value}
	{/if}
</div>

<style>
	.dt-td {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #f3f4f6;
	}
</style>
