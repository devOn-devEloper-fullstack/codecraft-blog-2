<script lang="ts">
	import StarterKit from '@tiptap/starter-kit';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import {
		Bold,
		Italic,
		Strikethrough,
		CodeXml,
		Pilcrow,
		Heading1,
		Heading2,
		Heading3,
		Heading4,
		Heading5,
		Heading6,
		List,
		ListOrdered,
		SquareCode,
		TextQuote
	} from 'lucide-svelte';
	import { Tooltip } from 'flowbite-svelte';

	let { contentHtml = $bindable(), contentJson = $bindable() } = $props();

	let element = <HTMLElement>$state();
	let editor = <Editor>$state();

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: `<p></p>`,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	$effect(() => {
		contentHtml = editor.getHTML();
		contentJson = editor.getJSON();
	});

	$inspect(contentHtml, contentJson, editor);
</script>

<div
	class="mx-6 mt-4 flex h-fit flex-col gap-3 rounded-2xl border px-5 pt-3 pb-3 text-card-foreground shadow-sm"
>
	{#if editor}
		<div class="control-group">
			<div class="flex flex-row gap-10 border-b pb-3">
				<button
					onclick={() => true && editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					class={editor.isActive('bold') ? 'is-active' : ''}
				>
					<Bold />
				</button>
				<Tooltip class="bg-gray-200 text-black">Bold</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					class={editor.isActive('italic') ? 'is-active' : ''}
				>
					<Italic />
				</button>
				<Tooltip class="bg-gray-200 text-black">Italic</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					class={editor.isActive('strike') ? 'is-active' : ''}
				>
					<Strikethrough />
				</button>
				<Tooltip class="bg-gray-200 text-black">Strike</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					class={editor.isActive('code') ? 'is-active' : ''}
				>
					<CodeXml />
				</button>
				<Tooltip class="bg-gray-200 text-black">Code</Tooltip>
				<button
					onclick={() => editor.chain().focus().setParagraph().run()}
					class={editor.isActive('paragraph') ? 'is-active' : ''}
				>
					<Pilcrow />
				</button>
				<Tooltip class="bg-gray-200 text-black">Paragraph</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					class={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
				>
					<Heading1 />
				</button>
				<Tooltip class="bg-gray-200 text-black">Heading 1</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					class={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
				>
					<Heading2 />
				</button>
				<Tooltip class="bg-gray-200 text-black">Heading 2</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					class={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
				>
					<Heading3 />
				</button>
				<Tooltip class="bg-gray-200 text-black">Heading 3</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
					class={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
				>
					<Heading4 />
				</button>
				<Tooltip class="bg-gray-200 text-black">Heading 4</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
					class={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
				>
					<Heading5 />
				</button>
				<Tooltip class="bg-gray-200 text-black">Heading 5</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
					class={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
				>
					<Heading6 />
				</button>
				<Tooltip class="bg-gray-200 text-black">Heading 6</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleBulletList().run()}
					class={editor.isActive('bulletList') ? 'is-active' : ''}
				>
					<List />
				</button>
				<Tooltip class="bg-gray-200 text-black">List</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleOrderedList().run()}
					class={editor.isActive('orderedList') ? 'is-active' : ''}
				>
					<ListOrdered />
				</button>
				<Tooltip class="bg-gray-200 text-black">Ordered List</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleCodeBlock().run()}
					class={editor.isActive('codeBlock') ? 'is-active' : ''}
				>
					<SquareCode />
				</button>
				<Tooltip class="bg-gray-200 text-black">Code Block</Tooltip>
				<button
					onclick={() => editor.chain().focus().toggleBlockquote().run()}
					class={editor.isActive('blockquote') ? 'is-active' : ''}
				>
					<TextQuote />
				</button>
				<Tooltip class="bg-gray-200 text-black">Block Quote</Tooltip>
				<button onclick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>
				<button onclick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</button>
			</div>
		</div>
	{/if}
	<div bind:this={element} contenteditable class="h-[50vh]"></div>
</div>
