// src/lib/server/render/rehype/pipeline.ts
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
// import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
// import rehypeSlug from 'rehype-slug';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// import rehypeExternalLinks from 'rehype-external-links';
import rehypeShiki from '@shikijs/rehype';
// import { addClassesPlugin } from './plugins/addClasses';
// import { defaultSchema } from 'hast-util-sanitize';
import { rehypeSvelteShiki } from './plugins/rehypeSvelteShiki';

const themes = { light: 'github-dark-default', dark: 'github-dark-default' };

export function createPostProcessor() {
	return (
		unified()
			// Input is trusted HTML from Tiptap renderer; we still parse+sanitize defensively
			.use(rehypeParse, {
				fragment: true,
				allowDangerousHtml: true
			})
			// .use(rehypeSanitize, {
			// 	...defaultSchema,
			// 	tagNames: [
			// 		...(defaultSchema.tagNames || []),
			// 		'br' // ✅ explicitly allow <br>
			// 	],
			// 	attributes: {
			// 		...defaultSchema.attributes,
			// 		// You usually don’t need attributes for <br>, but you can add global ones if needed.
			// 		br: [...(defaultSchema.attributes?.br || []), ['className']]
			// 	}
			// })
			// .use(rehypeSlug) // adds id attributes to headings
			// .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
			// .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
			// .use(addClassesPlugin, {
			// 	// our design-system class mappings
			// 	mapping: {
			// 		p: 'prose-p',
			// 		h1: 'prose-h1',
			// 		h2: 'prose-h2',
			// 		h3: 'prose-h3',
			// 		ul: 'prose-ul',
			// 		ol: 'prose-ol',
			// 		li: 'prose-li',
			// 		a: 'prose-a',
			// 		blockquote: 'prose-quote',
			// 		pre: 'prose-pre',
			// 		code: 'prose-code',
			// 		table: 'prose-table',
			// 		thead: 'prose-thead',
			// 		tbody: 'prose-tbody',
			// 		tr: 'prose-tr',
			// 		th: 'prose-th',
			// 		td: 'prose-td',
			// 		img: 'prose-img',
			// 		hr: 'prose-hr'
			// 	}
			// })
			.use(rehypeSvelteShiki, { themes })
			.use(rehypeShiki, { themes })
			.use(rehypeStringify, { allowDangerousHtml: true })
	);
}
