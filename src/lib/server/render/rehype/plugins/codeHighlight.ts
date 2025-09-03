/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/server/render/rehype/plugins/codeHighlight.ts
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common); // or import specific languages for smaller bundle

export const codeHighlight: Plugin<[{ themeClass?: string }?]> =
	(opts = {}) =>
	(tree: any) => {
		visit(
			tree,
			(node: any) => node.type === 'element' && node.tagName === 'code',
			(code, _index, parent) => {
				const classList = (code.properties?.className ?? []) as string[];
				const langClass = classList.find((c: string) => c.startsWith('language-'));
				const lang = langClass?.replace('language-', '');

				// Only highlight inside <pre><code>
				const isPre = parent && parent.type === 'element' && parent.tagName === 'pre';
				if (!isPre) return;

				const value = (code.children ?? [])
					.filter((c: any) => c.type === 'text')
					.map((c: any) => c.value)
					.join('');

				try {
					const result = lang ? lowlight.highlight(lang, value) : lowlight.highlightAuto(value);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					code.children = result.children as any[];
					// Ensure classes for theming
					const preClasses = (parent.properties?.className ?? []) as string[];
					parent.properties = parent.properties || {};
					parent.properties.className = Array.from(
						new Set([...preClasses, opts.themeClass || 'hljs'])
					);
				} catch {
					// If language not registered, leave as-is; still add hljs class for base styling
					const preClasses = (parent.properties?.className ?? []) as string[];
					parent.properties = parent.properties || {};
					parent.properties.className = Array.from(
						new Set([...preClasses, opts.themeClass || 'hljs'])
					);
				}
			}
		);
	};
