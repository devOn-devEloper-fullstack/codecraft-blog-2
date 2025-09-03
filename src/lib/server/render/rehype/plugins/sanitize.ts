// src/lib/server/render/rehype/plugins/sanitize.ts
import { defaultSchema } from 'hast-util-sanitize';

export const sanitizeSchema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		a: [...(defaultSchema.attributes?.a ?? []), ['target'], ['rel'], ['className']],
		code: [...(defaultSchema.attributes?.code ?? []), ['className']],
		pre: [...(defaultSchema.attributes?.pre ?? []), ['className']],
		img: [...(defaultSchema.attributes?.img ?? []), ['className'], ['loading'], ['decoding']],
		h1: [...(defaultSchema.attributes?.h1 ?? []), ['id'], ['className']],
		h2: [...(defaultSchema.attributes?.h2 ?? []), ['id'], ['className']],
		h3: [...(defaultSchema.attributes?.h3 ?? []), ['id'], ['className']],
		p: [...(defaultSchema.attributes?.p ?? []), ['className']]
		// etc…
	}
};
