// src/lib/server/render/rehype/plugins/addClasses.ts
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

type Options = { mapping: Record<string, string> };

export const addClassesPlugin: Plugin<[Options]> = (opts) => (tree: any) => {
	const mapping = opts?.mapping ?? {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	visit(tree, 'element', (node: any) => {
		const tag = node.tagName?.toLowerCase?.();
		const add = mapping[tag];
		if (!add) return;
		const existing = (node.properties?.className ?? []) as string[];
		node.properties = node.properties || {};
		node.properties.className = Array.from(new Set([...existing, ...add.split(' ')]));
	});
};
