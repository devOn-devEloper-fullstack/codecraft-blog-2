<!-- File: RichTextEditor.svelte (Svelte 5 + Tailwind) -->
<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import { onMount } from 'svelte';

	// === Props ===
	let {
		nameHtml = $bindable('content_html'),
		nameJson = $bindable('content_json'),
		initialHTML = null,
		initialJSON = null,
		placeholder = 'Write something...',
		editable = true,
		...restProps
	}: {
		nameHtml: string;
		nameJson: string;
		initialHTML: string | null;
		initialJSON: Record<string, any> | null;
		placeholder: string;
		editable: boolean;
	} = $props();

	// === Svelte 5 runes state ===
	let html = $state<string>(initialHTML ?? '');
	let json = $state<Record<string, any> | null>(initialJSON ?? null);
	let editor = $state<Editor | null>(null);
	let editorEl: HTMLDivElement | null = null;

	function initEditor() {
		if (!editorEl) return;
		editor = new Editor({
			element: editorEl,
			editable,
			extensions: [StarterKit],
			content: initialJSON ?? initialHTML ?? '<p></p>',
			onUpdate: ({ editor }) => {
				html = editor.getHTML();
				json = editor.getJSON();
			},
			onCreate: ({ editor }) => {
				html = editor.getHTML();
				json = editor.getJSON();
			}
		});
	}

	onMount(() => {
		initEditor();
		return () => editor?.destroy();
	});

	// React to prop changes with Svelte 5 $effect
	$effect(() => {
		if (editor) editor.setEditable(editable);
	});

	// If you need to change the placeholder dynamically, re-init the editor
	// (Placeholder options aren't hot-swappable in a trivial way)
	$effect(() => {
		// Recreate when placeholder string changes
		// Avoid rapid churn: only run if editor exists and placeholder differs
		if (editor) {
			const current = editor.extensionManager.extensions.find(
				(e) => (e as any).name === 'placeholder'
			) as any;
			const currentText = current?.options?.placeholder;
			if (currentText !== placeholder) {
				const snapshotHTML = editor.getHTML();
				const snapshotJSON = editor.getJSON();
				editor.destroy();
				// update initial content refs
				initialHTML = snapshotHTML;
				initialJSON = snapshotJSON;
				initEditor();
			}
		}
	});

	// toolbar helpers
	function chain(fn: (e: Editor) => void) {
		if (!editor) return;
		editor.chain().focus();
		fn(editor);
	}
	const isActive = (name: string, attrs: Record<string, any> = {}) =>
		editor?.isActive(name as any, attrs) ?? false;
</script>

<!-- Toolbar -->
<div
	class="flex items-center gap-2 rounded-t-xl border border-b-0 border-zinc-200 bg-white/70 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/50"
>
	<button
		type="button"
		title="Bold"
		class="rounded-lg px-2 py-1 font-semibold hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('bold')}
		onclick={() => chain((e) => e.can().chain().focus().toggleBold().run())}>B</button
	>
	<button
		type="button"
		title="Italic"
		class="rounded-lg px-2 py-1 italic hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('italic')}
		onclick={() => chain((e) => e.can().chain().focus().toggleItalic().run())}>I</button
	>
	<button
		type="button"
		title="Strike"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('strike')}
		onclick={() => chain((e) => e.can().chain().focus().toggleStrike().run())}
		><span class="line-through">S</span></button
	>
	<span class="h-5 w-px bg-zinc-200"></span>
	<button
		type="button"
		title="Heading 2"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('heading', { level: 2 })}
		onclick={() => chain((e) => e.can().chain().focus().toggleHeading({ level: 2 }).run())}
		>H2</button
	>
	<button
		type="button"
		title="Bullet List"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('bulletList')}
		onclick={() => chain((e) => e.can().chain().focus().toggleBulletList().run())}>• List</button
	>
	<button
		type="button"
		title="Ordered List"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('orderedList')}
		onclick={() => chain((e) => e.can().chain().focus().toggleOrderedList().run())}>1. List</button
	>
	<span class="h-5 w-px bg-zinc-200"></span>
	<button
		type="button"
		title="Blockquote"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('blockquote')}
		onclick={() => chain((e) => e.can().chain().focus().toggleBlockquote().run())}>❝quote❞</button
	>
	<button
		type="button"
		title="Code Block"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px data-[active=true]:bg-zinc-100"
		data-active={isActive('codeBlock')}
		onclick={() => chain((e) => e.can().chain().focus().toggleCodeBlock().run())}>{`</>`}</button
	>
	<span class="grow"></span>
	<button
		type="button"
		title="Undo"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px"
		onclick={() => chain((e) => e.can().chain().focus().undo().run())}>↶</button
	>
	<button
		type="button"
		title="Redo"
		class="rounded-lg px-2 py-1 hover:bg-zinc-100 active:translate-y-px"
		onclick={() => chain((e) => e.can().chain().focus().redo().run())}>↷</button
	>
</div>

<!-- Editor content element (Tiptap binds here) -->
<div class="overflow-hidden rounded-b-xl border border-zinc-200 shadow-sm">
	<div
		bind:this={editorEl}
		class="prose prose-zinc min-h-40 max-w-none p-4 text-zinc-900 outline-none"
		role="textbox"
		aria-multiline="true"
		contenteditable
	></div>
</div>

<!-- Hidden inputs for form integration -->
<input name={nameHtml} bind:value={html} />
<input type="hidden" name={nameJson} value={JSON.stringify(json)} />

<!--
USAGE (SvelteKit + forms)

<script lang="ts">
  import RichTextEditor from './RichTextEditor.svelte';
</script>

<form method="POST" action="?/save">
  <label class="block mb-2 text-sm text-zinc-600">Title</label>
  <input name="title" placeholder="Title" class="mb-3 w-full rounded-lg border border-zinc-200 px-3 py-2" />

  <RichTextEditor
    nameHtml="body_html"
    nameJson="body_json"
    placeholder="Write your post…"
  />

  <button type="submit" class="mt-4 inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 shadow-sm hover:bg-zinc-50">Save</button>
</form>

Server action receives `body_html` (string) and `body_json` (JSON string) via `request.formData()`.
-->

<style>
	/* Minimal local tweaks beyond Tailwind (optional) */
</style>
