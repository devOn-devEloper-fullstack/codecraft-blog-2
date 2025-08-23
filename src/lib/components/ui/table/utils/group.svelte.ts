// src/lib/utils/group.svelte.ts
import type { GroupConfig, Row } from '../types';

export type GroupNode<T extends Row = Row> = {
	key: string; // e.g. "status=Open"
	label: string; // display label
	path: string; // dot path for collapse map
	depth: number; // 0..n
	rows?: T[]; // leaf rows for last level
	children?: GroupNode<T>[];
};

export function groupRows<T extends Row>(rows: T[], cfg: GroupConfig<T>): GroupNode<T>[] {
	if (!cfg.by?.length) return [];
	const [first, ...rest] = cfg.by;
	const by = String(first);
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const groups = new Map<string, T[]>();
	for (const r of rows) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const key = String((r as any)[by]);
		const arr = groups.get(key) ?? [];
		arr.push(r);
		groups.set(key, arr);
	}
	const out: GroupNode<T>[] = [];
	for (const [key, list] of groups) {
		const path = `${by}=${key}`;
		if (rest.length === 0) {
			out.push({ key, label: key, path, depth: 0, rows: list });
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const children = groupRows(list, { by: rest as any, collapsed: cfg.collapsed });
			for (const c of children) c.path = `${path}.${c.path}`;
			out.push({ key, label: key, path, depth: 0, children });
		}
	}
	return out;
}
