// src/lib/state/tableState.svelte.ts
import { applySort } from '../utils/sort.svelte.ts';
import { applyFilters } from '../utils/filter.svelte.ts';
import { pageCount, slicePage } from '../utils/paginate.svelte.ts';
import { groupRows, type GroupNode } from '../utils/group.svelte.ts';
import type { ColumnDef, GroupConfig, Pagination, Row, SortRule, TableStateConfig } from '../types';

export type TableState<T extends Row = Row> = ReturnType<typeof createTableState<T>>;

export function createTableState<T extends Row>(cfg: TableStateConfig<T>) {
	// core state (deep reactive proxies)
	let rows = $state<T[]>(cfg.rows ?? []);
	let columns = $state<ColumnDef<T>[]>(cfg.columns ?? []);
	let sort = $state<SortRule<T>[]>(cfg.sort ?? []);
	let pagination = $state<Pagination>({ pageIndex: 0, pageSize: 10, ...(cfg.pagination ?? {}) });
	let filters = $state<Record<string, unknown>>(cfg.filters ?? {});
	let globalQuery = $state<string>(cfg.globalQuery ?? '');
	let grouping = $state<GroupConfig<T> | undefined>(cfg.grouping);
	const getId = cfg.getId ?? ((_, i) => String(i));

	// derived pipelines
	let filtered = $derived(applyFilters(rows, filters, globalQuery));
	let sorted = $derived(applySort(filtered, sort));

	// grouping (optional)
	let grouped: GroupNode<T>[] | undefined = $derived(
		grouping?.by?.length ? groupRows(sorted, grouping as any) : undefined
	);

	let total = $derived(sorted.length);
	let pageTotal = $derived(pageCount(total, pagination.pageSize));
	let pageRows = $derived(slicePage(sorted, pagination.pageIndex, pagination.pageSize));

	// actions
	function setRows(next: T[]) {
		rows = next;
	}
	function setColumns(next: ColumnDef<T>[]) {
		columns = next;
	}
	function toggleSort(key: keyof T & string, multi = false) {
		const curr = sort.find((s) => s.key === key);
		if (!multi)
			sort = curr ? [{ key, dir: curr.dir === 'asc' ? 'desc' : 'asc' }] : [{ key, dir: 'asc' }];
		else {
			if (!curr) sort = [...sort, { key, dir: 'asc' }];
			else curr.dir = curr.dir === 'asc' ? 'desc' : 'asc';
		}
	}
	function clearSort() {
		sort = [];
	}
	function setFilter(key: string, value: unknown) {
		(filters as any)[key] = value;
		pagination.pageIndex = 0;
	}
	function clearFilters() {
		filters = {};
	}
	function setGlobalQuery(q: string) {
		globalQuery = q;
		pagination.pageIndex = 0;
	}
	function setPageIndex(i: number) {
		pagination.pageIndex = Math.max(0, Math.min(i, pageTotal - 1));
	}
	function setPageSize(size: number) {
		pagination.pageSize = Math.max(1, size);
		pagination.pageIndex = 0;
	}
	function setGrouping(g: GroupConfig<T> | undefined) {
		grouping = g;
	}
	function toggleCollapsed(path: string) {
		if (!grouping) return;
		grouping.collapsed ??= {};
		grouping.collapsed[path] = !grouping.collapsed[path];
	}

	// helpers
	function isCollapsed(path: string) {
		return !!grouping?.collapsed?.[path];
	}
	function idFor(row: T, idx: number) {
		return getId(row, idx);
	}

	return {
		// state
		rows,
		columns,
		sort,
		pagination,
		filters,
		globalQuery,
		grouping,
		// derived
		filtered,
		sorted,
		grouped,
		total,
		pageTotal,
		pageRows,
		// actions
		setRows,
		setColumns,
		toggleSort,
		clearSort,
		setFilter,
		clearFilters,
		setGlobalQuery,
		setPageIndex,
		setPageSize,
		setGrouping,
		toggleCollapsed,
		// helpers
		isCollapsed,
		idFor
	};
}
