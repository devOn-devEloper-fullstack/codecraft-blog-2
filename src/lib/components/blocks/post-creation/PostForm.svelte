<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { DateLabel } from '$lib/components/ui/date/';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { formSchema } from '../../../../routes/(protected)/me/posts/create/schema';
	import SlugField from '../SlugField.svelte';
	import TagInput from '../TagInput.svelte';
	import Editor from '../editor/Editor.svelte';
	import ImageAddition from './ImageAddition.svelte';
	import ImageSelection from './ImageSelection.svelte';
	import {
		toggleFormModalState,
		toggleSelectionModalState,
		fetchImageData,
		getSelectedImage,
		getEditorState
	} from './state.svelte';

	/** Properties **/
	let { data } = $props();

	/** Sveltekit Superforms **/
	let formCreate = $derived(
		superForm(data.form, {
			validators: zod4Client(formSchema),
			dataType: 'json'
		})
	);

	let formData = $derived(formCreate.form);
	let errors = $derived(formCreate.errors);

	function onSubmit() {
		$formData.contentHtml = getEditorState()?.getHTML();
		$formData.contentJson = getEditorState()?.getJSON();

		console.log($formData);
	}
</script>

<form
	action="?/createPost"
	method="POST"
	id="post-creation"
	onsubmit={() => onSubmit()}
	class="grid grid-cols-[1fr_1fr]"
>
	<div class="mx-6 flex flex-col space-y-8">
		<Form.Field form={formCreate} name="title">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Post Title</Form.Label>
					<Input
						{...props}
						bind:value={$formData.title}
						placeholder="Enter a title for your post"
						name="title-input"
					/>
					<input
						bind:value={$formData.title}
						type="text"
						name="title"
						placeholder="Write a title for your next blog post"
						hidden
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={formCreate} name="slug">
			<Form.Control>
				{#snippet children()}
					<Form.Label>Post Slug</Form.Label>
					<SlugField bind:title={$formData.title} bind:slug={$formData.slug} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={formCreate} name="excerpt">
			<Form.Control>
				{#snippet children()}
					<Form.Label>Post Excerpt</Form.Label>
					<Input
						bind:value={$formData.excerpt}
						type="text"
						name="excerpt"
						placeholder="Describe your post for your audience"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={formCreate} name="tags">
			<Form.Control>
				{#snippet children()}
					<Form.Label>Post Tags</Form.Label>
					<TagInput bind:tags={$formData.tags} />
					<input
						bind:value={$formData.tags}
						type="text"
						name="tags"
						placeholder="Separate your tags by commas"
						hidden
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="mb-4 flex flex-col space-y-2">
			<span class="text-xl font-semibold">Images:</span>
			<button
				type="button"
				class="w-fit rounded-md bg-[var(--primary)] px-4 py-2 text-white hover:bg-[var(--primary-500)]"
				onclick={(e) => {
					e.preventDefault();
					toggleFormModalState();
				}}>Add Images</button
			>
			<button
				type="button"
				class="w-fit rounded-md border border-[var(--primary)] px-4 py-2 text-black hover:bg-gray-100"
				onclick={(e) => {
					e.preventDefault();
					toggleSelectionModalState();
				}}
				onmouseenter={fetchImageData}
			>
				Select from Gallery
			</button>
			{#if getSelectedImage()}
				<span class="text-md ml-2 text-[var(--destructive)]">Image Selected</span>
			{/if}
		</div>
		<ImageAddition {data} />
		<ImageSelection />
	</div>

	<div class="flex flex-col gap-2">
		<span class="py-2 text-xl font-semibold">Post Content</span>
		<Editor
			image={getSelectedImage()}
			content="<p>Write something beautiful...</p>"
			bind:htmlContent={$formData.contentHtml}
			bind:jsonContent={$formData.contentJson}
		/>

		<div class="flex w-full flex-row items-center justify-between">
			<div class="mx-6 mt-6 flex w-[35%] flex-row justify-between gap-6">
				<Form.Button class="h-fit w-[180px] text-2xl " formaction="?/createPost">Submit</Form.Button
				>
				<Button
					type="submit"
					class="h-fit w-[180px] border border-[var(--primary)] bg-white text-2xl text-black hover:bg-gray-100"
					formaction="?/saveDraft">Save Draft</Button
				>
			</div>

			<DateLabel class="mx-6 mt-6 justify-between" />
		</div>
	</div>
</form>
