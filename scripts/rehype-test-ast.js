// pipeline-test.mjs
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype'; // official Shiki rehype plugin
import { codeToHtml } from 'shiki';
import { visit, SKIP } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import { toHtml } from 'hast-util-to-html';
import { fromHtml } from 'hast-util-from-html';

/** Helper */
function hasLang(node, lang) {
	const cls = node.properties?.className;
	const list = Array.isArray(cls) ? cls : typeof cls === 'string' ? cls.split(/\s+/) : [];
	return list.some((c) => c.toLowerCase() === `language-${lang}`);
}

/** Remove language-* classes so the generic rehypeShiki won’t re-process our Svelte blocks */
function stripLanguageClasses(hastNode) {
	visit(hastNode, 'element', (el) => {
		if (el.tagName === 'code' && el.properties?.className) {
			const list = Array.isArray(el.properties.className)
				? el.properties.className
				: typeof el.properties.className === 'string'
					? el.properties.className.split(/\s+/)
					: [];
			el.properties.className = list.filter((c) => !/^language-/.test(c));
		}
	});
}

/** Our custom highlighter for Svelte blocks */
function rehypeSvelteShiki({ themes }) {
	return async function transformer(tree) {
		const tasks = [];
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

/** --------- Demo input --------- */
const input = `
  <h2>TS (should be highlighted by @shikijs/rehype):</h2>
  <pre><code class="language-typescript">const x: number = 42;</code></pre>

  <h2>Svelte (contains &lt;script&gt; and Svelte syntax):</h2>
  <pre><code class="language-svelte"><script>let visible = $state(true);</script>
{#if visible}
  <p>Hello</p>
{/if}
</code></pre>
`;

/** --------- Run pipeline --------- */
const themes = { light: 'github-dark-default', dark: 'github-dark-default' }; // pick your themes

const file = await unified()
	.use(rehypeParse, { fragment: true })
	.use(rehypeSvelteShiki, { themes }) // handle Svelte first
	.use(rehypeShiki, { themes }) // then let the official plugin handle other langs
	.use(rehypeStringify)
	.process(input);

console.log(String(file));

// // rehype-test-ast.js
// import { unified } from 'unified';
// import rehypeParse from 'rehype-parse';
// import rehypeStringify from 'rehype-stringify';
// import { inspect } from 'unist-util-inspect';
// import rehypeShiki from '@shikijs/rehype';
// import { visit } from 'unist-util-visit';
// import { codeToHtml } from 'shiki';

// function rehypeSvelteShiki(options) {
// 	return async (tree) => {
// 		const promises = [];
// 		visit(tree, 'element', (node) => {
// 			if (node.tagName === 'code' && node.properties?.className?.includes('language-svelte')) {
// 				const code = node.children
// 					.filter((c) => c.type === 'text')
// 					.map((c) => c.value)
// 					.join('');
// 				promises.push(
// 					codeToHtml(code, { lang: 'svelte', theme: options.theme }).then((html) => {
// 						// Replace node children with Shiki's output
// 						node.children = [{ type: 'raw', value: html }];
// 					})
// 				);
// 			}
// 		});
// 		await Promise.all(promises);
// 	};
// }

// const examples = [
// 	{
// 		name: 'Svelte block',
// 		language: 'svelte',
// 		html: `<h1>Svelte Block Example</h1><pre><code class="language-svelte">{#if visible}<p>Hello</p>{/if}</code></pre>`
// 	},
// 	{
// 		name: 'Svelte Block with Script',
// 		language: 'svelte',
// 		html: `<h1>Svelte Block with Script</h1><pre><code class="language-svelte">\n<script lang="ts">\nlet visible = $state(true);\n</script>\n\n{#if visible}\n<p>Hello</p>\n{/if}</code></pre>`
// 	},
// 	{
// 		name: 'TypeScript block',
// 		language: 'typescript',
// 		html: `<pre><code class="language-typescript">const x: number = 42;</code></pre>`
// 	},
// 	{
// 		name: 'Plain block',
// 		language: 'plaintext',
// 		html: `<pre><code>console.log("plain");</code></pre>`
// 	}
// ];

// async function run() {
// 	for (const { name, html } of examples) {
// 		console.log(`\n=== ${name} ===`);
// 		console.log('Original:');
// 		console.log(html);

// 		// Step 1: parse into AST
// 		const tree = unified().use(rehypeParse, { fragment: true }).parse(html);

// 		console.log('\nAST:');
// 		console.log(inspect(tree));

// 		// Step 2: stringify back into HTML
// 		const result = await unified()
// 			.use(rehypeParse, { fragment: true, allowDangerousHtml: true })
// 			.use(rehypeSvelteShiki, { theme: 'github-dark' })
// 			.use(rehypeShiki, { theme: 'github-dark' })
// 			.use(rehypeStringify, { allowDangerousHtml: true })
// 			.process(html);

// 		console.log('\nAfter stringify:');
// 		console.log(String(result));
// 	}
// }

// run().catch(console.error);
