<script lang="ts">
	import './styles/editor.css';
	import type { EditorProps } from '$lib/types';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise';
	import ArrowClockwise from 'phosphor-svelte/lib/ArrowClockwise';
	import TextB from 'phosphor-svelte/lib/TextB';
	import TextItalic from 'phosphor-svelte/lib/TextItalic';
	import TextStrikethrough from 'phosphor-svelte/lib/TextStrikethrough';
	import TextHOne from 'phosphor-svelte/lib/TextHOne';
	import TextHTwo from 'phosphor-svelte/lib/TextHTwo';
	import TextHThree from 'phosphor-svelte/lib/TextHThree';
	import TextHFour from 'phosphor-svelte/lib/TextHFour';
	import Code from 'phosphor-svelte/lib/Code';
	import ListBullets from 'phosphor-svelte/lib/ListBullets';
	import ListNumbers from 'phosphor-svelte/lib/ListNumbers';
	import Quotes from 'phosphor-svelte/lib/Quotes';
	import CodeBlock from 'phosphor-svelte/lib/CodeBlock';
	import Link from 'phosphor-svelte/lib/Link';
	import Image from 'phosphor-svelte/lib/Image';
	import { preventDefault } from 'svelte/legacy';

	let {
		editor,
		image
	}: Omit<EditorProps, 'controlToolbar' | 'htmlContent' | 'jsonContent' | 'content'> = $props();

	const setLink = () => {
		const previousUrl = editor?.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor?.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		// update link
		try {
			editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
		} catch (error) {
			alert(error);
		}
	};
</script>

<div class="toolbar-container">
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().undo().run();
		}}
		disabled={!editor?.can().chain().focus().undo().run()}
		class="toolbar-button"
		type="button"
	>
		<ArrowCounterClockwise size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().redo().run();
		}}
		disabled={!editor?.can().chain().focus().redo().run()}
		class="toolbar-button"
		type="button"
	>
		<ArrowClockwise size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleBold().run();
		}}
		disabled={!editor?.can().chain().focus().toggleBold().run()}
		class:active={editor?.isActive('bold') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<TextB size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleItalic().run();
		}}
		disabled={!editor?.can().chain().focus().toggleItalic().run()}
		class:active={editor?.isActive('italic') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<TextItalic size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleStrike().run();
		}}
		disabled={!editor?.can().chain().focus().toggleStrike().run()}
		class:active={editor?.isActive('strike') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<TextStrikethrough size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleCode().run();
		}}
		disabled={!editor?.can().chain().focus().toggleCode().run()}
		class:active={editor?.isActive('code') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<Code size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleBulletList().run();
		}}
		class:active={editor?.isActive('bulletList') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<ListBullets size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleOrderedList().run();
		}}
		class:active={editor?.isActive('orderedList') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<ListNumbers size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleBlockquote().run();
		}}
		class:active={editor?.isActive('blockquote') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<Quotes size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleCodeBlock().run();
		}}
		class:active={editor?.isActive('codeBlock') ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<CodeBlock size={26} weight="thin" />
	</button>
	<button class="toolbar-button" onclick={setLink} type="button">
		<Link size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor
				?.chain()
				.focus()
				.setImage({ src: image ?? '' })
				.run();
		}}
		class="toolbar-button"
		type="button"
	>
		<Image size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleHeading({ level: 1 }).run();
		}}
		class:active={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<TextHOne size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleHeading({ level: 2 }).run();
		}}
		class:active={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<TextHTwo size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleHeading({ level: 3 }).run();
		}}
		class:active={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<TextHThree size={26} weight="thin" />
	</button>
	<button
		onclick={(e) => {
			e.preventDefault;
			editor?.chain().focus().toggleHeading({ level: 4 }).run();
		}}
		class:active={editor?.isActive('heading', { level: 4 }) ? 'is-active' : ''}
		class="toolbar-button"
		type="button"
	>
		<TextHFour size={26} weight="thin" />
	</button>
</div>
