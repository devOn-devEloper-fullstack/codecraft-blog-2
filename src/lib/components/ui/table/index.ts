// src/lib/index.ts

// Types
export * from './types';
export type { TableState } from './state/tableState.svelte.ts';

// State (runes-based store in a .svelte.ts module)
//@ts-expect-error will not allow files ending in .svelte.ts
export { createTableState } from './state/tableState.svelte.ts';

// Headless components
export { default as DataTable } from './table-components/data-table.svelte';
export { default as DataTableToolbar } from './table-components/data-table-toolbar.svelte';
export { default as DataTableHeader } from './table-components/data-table-header.svelte';
export { default as DataTableBody } from './table-components/data-table-body.svelte';
export { default as DataTablePagination } from './table-components/data-table-pagination.svelte';
export { default as DataTableEmpty } from './table-components/data-table-empty.svelte';

// Row/Cell helpers (new)
export { default as DataTableRow } from './table-components/data-table-row.svelte';
export { default as DataTableCell } from './table-components/data-table-cell.svelte';
