import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

new Editor({
	// bind Tiptap to the `.element`
	element: document.querySelector('.element'),
	// register extensions
	extensions: [StarterKit],
	// set the initial content
	content: '<p>Example Text</p>',
	// place the cursor in the editor after initialization
	autofocus: true,
	// make the text editable (default is true)
	editable: true,
	// prevent loading the default ProseMirror CSS that comes with Tiptap
	// should be kept as `true` for most cases as it includes styles
	// important for Tiptap to work correctly
	injectCSS: false
});
