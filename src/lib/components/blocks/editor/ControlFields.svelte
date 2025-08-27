<script>
	// @ts-nocheck

	let tipex = $props();

	let isActive = $derived((name, attrs = {}) => tipex?.isActive(name, attrs) ?? false);
	let canExecute = $derived((command) => tipex?.can()[command]() ?? false);
</script>

<div class="custom-toolbar">
	<div class="toolbar-section">
		<button
			class="toolbar-btn"
			class:active={isActive('bold')}
			disabled={!canExecute('toggleBold')}
			onclick={() => tipex.chain().focus().toggleBold().run()}
		>
			<strong>B</strong>
		</button>

		<button
			class="toolbar-btn"
			class:active={isActive('italic')}
			onclick={() => tipex.chain().focus().toggleItalic().run()}
		>
			<em>I</em>
		</button>
	</div>

	<div class="toolbar-section">
		<select
			value={isActive('heading', { level: 1 })
				? '1'
				: isActive('heading', { level: 2 })
					? '2'
					: 'p'}
			onchange={(e) => {
				const level = e.target.value;
				if (level === 'p') {
					tipex.chain().focus().setParagraph().run();
				} else {
					tipex
						.chain()
						.focus()
						.toggleHeading({ level: parseInt(level) })
						.run();
				}
			}}
		>
			<option value="p">Paragraph</option>
			<option value="1">Heading 1</option>
			<option value="2">Heading 2</option>
		</select>
	</div>
</div>

<style>
	@reference './styles/editor.css'
	.custom-toolbar {
		@apply gap-tipex-md p-tipex-lg bg-tipex-control-bg dark:bg-tipex-control-bg-dark rounded-tipex-md shadow-tipex-sm border-tipex-control-border dark:border-tipex-control-border-dark flex border;
	}
</style>
