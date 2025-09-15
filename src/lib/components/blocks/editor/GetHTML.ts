import { DOMSerializer } from '@tiptap/pm/model';
import { Editor } from '@tiptap/core';

// Custom serializer that preserves line breaks in code blocks
function createCustomSerializer(schema) {
	const serializer = DOMSerializer.fromSchema(schema);

	serializer.nodes.codeBlock = (node) => {
		const { language } = node.attrs;
		const pre = document.createElement('pre');
		const code = document.createElement('code');

		if (language) {
			code.className = `language-${language}`;
		}

		// 🔑 This preserves all \n in the final HTML string
		code.textContent = node.textContent;

		pre.appendChild(code);
		return pre;
	};

	return serializer;
}

// Utility: getHTML with custom serializer
export function getFullHTMLWithPreservedNewlines(editor: Editor): string {
	const serializer = createCustomSerializer(editor.schema);
	const fragment = serializer.serializeFragment(editor.state.doc.content);

	const container = document.createElement('div');
	container.appendChild(fragment);

	return container.innerHTML;
}
