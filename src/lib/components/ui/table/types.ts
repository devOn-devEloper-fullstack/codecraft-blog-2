// Table Types

export type Row = Record<string, unknown>;

export type ColumnDef<T extends Row = Row> = {
	key: keyof T | string; // object key
	header: string; // header label
	width?: string; // e.g. '180px' | 'minmax(12rem,1fr)'
	sortable?: boolean;
	filter?:
		| { type: 'text'; placeholder?: string }
		| { type: 'select'; options: Array<{ label: string; value: string }>; multiple?: boolean }
		| { type: 'range'; min?: number; max?: number; step?: number };
	accessor?: (row: T) => unknown; // custom accessor (fallback key lookup)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	render?: (row: T) => any; // slot-like escape hatch for custom cells
};

export type SortDirection = 'asc' | 'desc';

export type SortRule<T extends Row = Row> = {
	key: keyof T & string;
	dir: SortDirection;
	/** optional rank for multi-sort, lower rank sorts applied first */
	rank?: number;
};

export type Pagination = {
	pageIndex: number; // 0-based
	pageSize: number; // items per page
};

export type GroupConfig<T extends Row = Row> = {
	by: Array<keyof T & string>; // keys to group by (in order)
	collapsed?: Record<string, boolean>; // path -> collapsed
};

export type TableStateConfig<T extends Row = Row> = {
	rows: T[];
	columns: ColumnDef<T>[];
	pagination?: Partial<Pagination>;
	sort?: SortRule<T>[];
	globalQuery?: string;
	filters?: Record<string, unknown>;
	grouping?: GroupConfig<T>;
	/** provide your own id getter, default uses index */
	getId?: (row: T, idx: number) => string;
};
