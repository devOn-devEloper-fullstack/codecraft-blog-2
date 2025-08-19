<script lang="ts">
	// Svelte 5: get action/form state
	let { form } = $props(); // optional if you read `form` result data
	import RichEditor from '$lib/components/blocks/RichEditor.svelte';
	import SlugField from '$lib/components/blocks/SlugField.svelte';
	import TagInput from '$lib/components/blocks/TagInput.svelte';

	let title = $state('');
	let slug = $state('');
	let excerpt = $state('');
	let tags: string[] = $state([]);

	// RichEditor exposes .getHTML() and .getJSON()
	let editorRef: RichEditor | null = $state(null);

	function beforeSubmit(e: SubmitEvent) {
		const formEl = e.target as HTMLFormElement;
		const html = editorRef?.getHTML() ?? '';
		const json = editorRef?.getJSON() ?? '';
		const htmlField = formEl.querySelector('input[name="contentHtml"]') as HTMLInputElement;
		const jsonField = formEl.querySelector('input[name="contentJson"]') as HTMLInputElement;
		htmlField.value = html;
		jsonField.value = json;
	}
</script>

<form method="POST" onsubmit={beforeSubmit}>
	<div class="stack">
		<label>
			<span>Title</span>
			<input name="title" bind:value={title} required />
		</label>

		<SlugField bind:title bind:slug />

		<label>
			<span>Excerpt</span>
			<textarea name="excerpt" rows="3" bind:value={excerpt}><</textarea>
		</label>

		<TagInput bind:tags />
		<input type="hidden" name="tags" value={tags.join(',')} />

		<div>
			<RichEditor bind:this={editorRef} />
			<input type="hidden" name="contentHtml" />
			<input type="hidden" name="contentJson" />
		</div>

		<label class="row">
			<input type="checkbox" name="publish" />
			<span>Publish immediately</span>
		</label>

		<button type="submit">Create Post</button>
	</div>
</form>

<style>
	.stack {
		display: grid;
		gap: 1rem;
		max-width: 760px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
