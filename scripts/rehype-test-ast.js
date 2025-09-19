// rehype-test-ast.js
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { inspect } from 'unist-util-inspect';
import rehypeShiki from '@shikijs/rehype';

const examples = [
	{
		name: 'Svelte block',
		html: `<pre><code class="language-svelte">{#if visible}<p>Hello</p>{/if}</code></pre>`
	},
	{
		name: 'Svelte Block with Script',
		html: `<pre><code class="language-svelte"><script lang="ts">let visible = $state(true);</script>{#if visible}<p>Hello</p>{/if}</code></pre>`
	},
	{
		name: 'TypeScript block',
		html: `<pre><code class="language-typescript">const x: number = 42;</code></pre>`
	},
	{
		name: 'Plain block',
		html: `<pre><code>console.log("plain");</code></pre>`
	}
];

async function run() {
	for (const { name, html } of examples) {
		console.log(`\n=== ${name} ===`);
		console.log('Original:');
		console.log(html);

		// Step 1: parse into AST
		const tree = unified().use(rehypeParse, { fragment: true }).parse(html);

		console.log('\nAST:');
		console.log(inspect(tree));

		// Step 2: stringify back into HTML
		const result = await unified()
			.use(rehypeParse, { fragment: true })
			.use(rehypeStringify)
			.use(rehypeShiki, { theme: 'github-dark-default' })
			.process(html);

		console.log('\nAfter stringify:');
		console.log(String(result));
	}
}

run().catch(console.error);
