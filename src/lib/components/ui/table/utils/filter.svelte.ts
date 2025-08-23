// Filter Feature
import type { Row } from '../types';

export function includesInsensitive(hay: unknown, needle: string) {
	return String(hay ?? '')
		.toLowerCase()
		.includes(needle.toLowerCase());
}

export function applyFilters<T extends Row>(
	rows: T[],
	filters: Record<string, unknown> = {},
	globalQuery?: string
) {
	const active = Object.entries(filters).filter(([, v]) => v != null && String(v).length > 0);
	if (!active.length && !globalQuery) return rows;
	return rows.filter((row) => {
		if (globalQuery && !Object.values(row).some((v) => includesInsensitive(v, globalQuery)))
			return false;
		for (const [key, val] of active) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const cell = (row as any)[key];
			if (Array.isArray(val)) {
				// multi-select: value must be one of
				if (!val.map(String).includes(String(cell))) return false;
			} else if (
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(typeof val === 'object' && val && 'min' in (val as any)) ||
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				'max' in (val as any)
			) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const { min, max } = val as any;
				const num = Number(cell);
				if (!Number.isFinite(num)) return false;
				if (min != null && num < min) return false;
				if (max != null && num > max) return false;
			} else {
				if (!includesInsensitive(cell, String(val))) return false;
			}
		}
		return true;
	});
}
