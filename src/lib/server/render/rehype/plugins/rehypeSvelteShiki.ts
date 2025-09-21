/* eslint-disable @typescript-eslint/no-explicit-any */

import { codeToHtml } from 'shiki';
import { visit, SKIP } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import { toHtml } from 'hast-util-to-html';
import { fromHtml } from 'hast-util-from-html';

/** Helper */
function hasLang(node: any, lang: string) {
	const cls = node.properties?.className;
	const list = Array.isArray(cls) ? cls : typeof cls === 'string' ? cls.split(/\s+/) : [];
	return list.some((c) => c.toLowerCase() === `language-${lang}`);
}

/** Remove language-* classes so the generic rehypeShiki won’t re-process our Svelte blocks */
function stripLanguageClasses(hastNode: any) {
	visit(hastNode, 'element', (el) => {
		if (el.tagName === 'code' && el.properties?.className) {
			const list = Array.isArray(el.properties.className)
				? el.properties.className
				: typeof el.properties.className === 'string'
					? el.properties.className.split(/\s+/)
					: [];
			el.properties.className = list.filter((c: any) => !/^language-/.test(c));
		}
	});
}

/** Our custom highlighter for Svelte blocks */
export function rehypeSvelteShiki({ themes }: any) {
	return async function transformer(tree: any) {
		const tasks: any[] = [];
		visitParents(tree, 'element', (node, ancestors) => {
			if (node.tagName !== 'code') return;
			if (!hasLang(node, 'svelte')) return;

			// Expect immediate parent <pre> and its parent (so we can replace <pre>)
			const pre = ancestors[ancestors.length - 1];
			const parent = ancestors[ancestors.length - 2];
			if (!pre || pre.type !== 'element' || pre.tagName !== 'pre' || !parent) return;

			// Rebuild the *full literal* code string, including things like <script>
			const codeLiteral = toHtml(node.children); // ← serializes child elements back to markup

			tasks.push(
				(async () => {
					// Shiki returns a full <pre class="shiki">…<code>…</code></pre>
					const shikiHtml = await codeToHtml(codeLiteral, { lang: 'svelte', themes });
					const frag = fromHtml(shikiHtml, { fragment: true });
					const shikiPre =
						frag.children.find((c) => c.type === 'element' && c.tagName === 'pre') ||
						frag.children[0];

					// Prevent the generic rehypeShiki from touching it again
					stripLanguageClasses(shikiPre);

					// Replace the original <pre> with Shiki’s <pre>
					const idx = parent.children.indexOf(pre);
					if (idx !== -1) parent.children[idx] = shikiPre;
				})()
			);

			// Skip walking into this subtree further (we're replacing it anyway)
			return SKIP;
		});
		await Promise.all(tasks);
	};
}
