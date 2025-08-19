<script lang="ts">
	let root: HTMLDivElement;
	export function getHTML() {
		return root?.innerHTML ?? '';
	}
	export function getJSON() {
		// super simple structural capture; replace with a real delta model if you adopt TipTap/ProseMirror
		return JSON.stringify({ html: getHTML() });
	}

	function cmd(command: string) {
		document.execCommand(command, false);
		root.focus();
	}
</script>

<div class="toolbar">
	<button type="button" on:click={() => cmd('bold')} aria-label="Bold"><strong>B</strong></button>
	<button type="button" on:click={() => cmd('italic')} aria-label="Italic"><em>I</em></button>
	<button type="button" on:click={() => cmd('underline')} aria-label="Underline"><u>U</u></button>
	<button type="button" on:click={() => cmd('insertUnorderedList')} aria-label="Bulleted list"
		>• List</button
	>
	<button type="button" on:click={() => cmd('formatBlock')} aria-label="Paragraph">¶</button>
</div>

<div class="editor" contenteditable bind:this={root}></div>

<style>
	.toolbar {
		display: flex;
		gap: 0.5rem;
		border: 1px solid #ccc;
		border-bottom: 0;
		padding: 0.25rem;
	}
	.editor {
		min-height: 240px;
		border: 1px solid #ccc;
		padding: 0.75rem;
		border-radius: 0.25rem;
		background: #fff;
	}
	button {
		border: 1px solid #ddd;
		background: #f6f6f6;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
	}
</style>
