<script lang="ts">
	import './styles/editor.css';
	import type { EditorProps } from '$lib/types';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise';
	import ArrowClockwise from 'phosphor-svelte/lib/ArrowClockwise';
	import TextB from 'phosphor-svelte/lib/TextB';
	import TextItalic from 'phosphor-svelte/lib/TextItalic';
	import TextStrikethrough from 'phosphor-svelte/lib/TextStrikethrough';
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown';
	import TextHOne from 'phosphor-svelte/lib/TextHOne';
	import TextHTwo from 'phosphor-svelte/lib/TextHTwo';
	import TextHThree from 'phosphor-svelte/lib/TextHThree';
	import TextHFour from 'phosphor-svelte/lib/TextHFour';
	import TextHFive from 'phosphor-svelte/lib/TextHFive';
	import TextHSix from 'phosphor-svelte/lib/TextHSix';
	import Paragraph from 'phosphor-svelte/lib/Paragraph';
	import Code from 'phosphor-svelte/lib/Code';
	import ListBullets from 'phosphor-svelte/lib/ListBullets';
	import ListNumbers from 'phosphor-svelte/lib/ListNumbers';
	import Quotes from 'phosphor-svelte/lib/Quotes';
	import CodeBlock from 'phosphor-svelte/lib/CodeBlock';
	import Link from 'phosphor-svelte/lib/Link';
	import Image from 'phosphor-svelte/lib/Image';
	import { Select } from 'bits-ui';

	let { editor, image }: Omit<EditorProps, 'controlToolbar'> = $props();

	const setLink = () => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		// update link
		try {
			editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
		} catch (e) {
			alert(e.message);
		}
	};
</script>

<div class="toolbar-container">
	<button
		onclick={() => editor?.chain().focus().undo().run()}
		disabled={!editor?.can().chain().focus().undo().run()}
		class="toolbar-button"
	>
		<ArrowCounterClockwise size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().redo().run()}
		disabled={!editor?.can().chain().focus().redo().run()}
		class="toolbar-button"
	>
		<ArrowClockwise size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleBold().run()}
		disabled={!editor?.can().chain().focus().toggleBold().run()}
		class:active={editor?.isActive('bold') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<TextB size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleItalic().run()}
		disabled={!editor?.can().chain().focus().toggleItalic().run()}
		class:active={editor?.isActive('italic') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<TextItalic size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleStrike().run()}
		disabled={!editor?.can().chain().focus().toggleStrike().run()}
		class:active={editor?.isActive('strike') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<TextStrikethrough size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleCode().run()}
		disabled={!editor?.can().chain().focus().toggleCode().run()}
		class:active={editor?.isActive('code') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<Code size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleBulletList().run()}
		class:active={editor?.isActive('bulletList') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<ListBullets size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleOrderedList().run()}
		class:active={editor?.isActive('orderedList') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<ListNumbers size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleBlockquote().run()}
		class:active={editor?.isActive('blockquote') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<Quotes size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleCodeBlock().run()}
		class:active={editor?.isActive('codeBlock') ? 'is-active' : ''}
		class="toolbar-button"
	>
		<CodeBlock size={26} weight="thin" />
	</button>
	<button class="toolbar-button" onclick={setLink}>
		<Link size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().setImage({ src: image }).run()}
		class="toolbar-button"
	>
		<Image size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
		class="toolbar-button"
	>
		<TextHOne size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
		class="toolbar-button"
	>
		<TextHTwo size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
		class:active={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
		class="toolbar-button"
	>
		<TextHThree size={26} weight="thin" />
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
		class:active={editor?.isActive('heading', { level: 4 }) ? 'is-active' : ''}
		class="toolbar-button"
	>
		<TextHFour size={26} weight="thin" />
	</button>
</div>
