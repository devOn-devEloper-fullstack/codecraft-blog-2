// Sort Feature
import type { Row, SortRule } from '../types';

export function applySort<T extends Row>(rows: T[], rules: SortRule<T>[]): T[] {
	if (!rules?.length) return rows;
	// stable copy
	const copy = [...rows];
	const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
	copy.sort((a, b) => {
		for (const { key, dir } of rules) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const va = (a as any)[key];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const vb = (b as any)[key];
			const typeA = typeof va;
			const typeB = typeof vb;
			let cmp = 0;
			if (typeA === 'number' && typeB === 'number') cmp = (va as number) - (vb as number);
			else cmp = collator.compare(String(va ?? ''), String(vb ?? ''));
			if (cmp !== 0) return dir === 'asc' ? cmp : -cmp;
		}
		return 0;
	});
	return copy;
}
