<script lang="ts">
	import {
		AlignmentButtonGroup,
		FontButtonGroup,
		UndoRedoButtonGroup,
		FormatButtonGroup,
		LayoutButtonGroup,
		ImageButtonGroup,
		ListButtonGroup,
		YoutubeButtonGroup,
		TextEditor,
		ToolbarRowWrapper,
		Divider,
		SourceButton
	} from '@flowbite-svelte-plugins/texteditor';
	import type { Editor } from '@tiptap/core';
	import { Button } from 'flowbite-svelte';

	let editorInstance = $state<Editor | null>(null);

	function getEditorContent() {
		return editorInstance?.getHTML() ?? '';
	}

	function setEditorContent(content: string) {
		editorInstance?.commands.setContent(content);
	}

	const content = '';
</script>

<TextEditor bind:editor={editorInstance} {content}>
	<ToolbarRowWrapper>
		<FormatButtonGroup editor={editorInstance} />
		<Divider />
		<FontButtonGroup editor={editorInstance} />
		<Divider />
		<AlignmentButtonGroup editor={editorInstance} />
	</ToolbarRowWrapper>
	<ToolbarRowWrapper>
		<UndoRedoButtonGroup editor={editorInstance} />
		<Divider />
		<LayoutButtonGroup editor={editorInstance} />
		<Divider />
		<ListButtonGroup editor={editorInstance} />
		<Divider />
		<ImageButtonGroup editor={editorInstance} />
		<Divider />
		<YoutubeButtonGroup editor={editorInstance} />
		<SourceButton editor={editorInstance} />
	</ToolbarRowWrapper>
</TextEditor>

<div class="mt-4">
	<Button onclick={() => console.log(getEditorContent())}>Get Content</Button>
	<Button onclick={() => setEditorContent('<p>New content!</p>')}>Set Content</Button>
</div>
