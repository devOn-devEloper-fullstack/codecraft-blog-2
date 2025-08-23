// Pagination Feature
export function slicePage<T>(rows: T[], pageIndex: number, pageSize: number) {
	const start = pageIndex * pageSize;
	return rows.slice(start, start + pageSize);
}

export function pageCount(total: number, pageSize: number) {
	return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
}
