<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { DateLabel } from '$lib/components/ui/date';
	import RichEditor from '$lib/components/blocks/RichEditor.svelte';
	import SlugField from '$lib/components/blocks/SlugField.svelte';
	import TagInput from '$lib/components/blocks/TagInput.svelte';
	import Editor from '@tinymce/tinymce-svelte';

	let { data }: { data: PageData } = $props();

	let conf = {
		height: 500,
		menubar: false,
		plugins: [
			'advlist',
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'anchor',
			'searchreplace',
			'visualblocks',
			'code',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'preview',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | blocks | ' +
			'bold italic forecolor | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'removeformat | help'
	};

	let form = $derived(
		superForm(data.form, {
			validators: zod4Client(formSchema),
			dataType: 'json'
		})
	);

	let formData = $derived(form.form);
	let errors = $derived(form.errors);
	let message = $derived(form.message);
	let submitting = $derived(form.submitting);
	let enhance = $derived(form.enhance);

	$inspect($formData.contentHtml);

	function formSubmit() {}

	// }
</script>

<main class="mx-6 my-8 w-[100vw]">
	<div class="mb-2 flex w-[50vw] flex-col gap-3">
		<Card.Header><h1 class="text-4xl font-semibold">Create a blog post</h1></Card.Header>
		<Card.Description class="ml-8"
			>Fill out the fields below to create a blog post.</Card.Description
		>
		{#if $errors?._errors}
			<div class="mt-3 rounded-md text-red-700">
				{$errors?._errors}
			</div>
		{/if}
		<section>
			<form action="?/default" method="POST" use:enhance>
				<div class="mx-6">
					<Form.Field {form} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Post Title</Form.Label>
								<Input
									{...props}
									bind:value={$formData.title}
									placeholder="Enter a title for your post"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="slug">
						<Form.Control>
							{#snippet children()}
								<Form.Label>Post Slug</Form.Label>
								<SlugField bind:title={$formData.title} bind:slug={$formData.slug} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="tags">
						<Form.Control>
							{#snippet children()}
								<Form.Label>Post Tags</Form.Label>
								<TagInput bind:tags={$formData.tags} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<!-- <RichEditor
					bind:contentHtml={$formData.contentHtml}
					bind:contentJson={$formData.contentJson}
				/> -->

				<Editor
					apiKey="u2bmg51o325t8jlpn4tv96tpjb0w49740u1706xg7i6i8cgu"
					value="<p>This is the initial content of the editor.</p>"
					{conf}
				/>

				<div class="flex w-full flex-row items-center justify-between">
					<div class="mx-6 mt-6 flex w-[35%] flex-row justify-between gap-6">
						<Form.Button class="h-fit w-[180px] text-2xl">publish</Form.Button>
						<Button
							type="button"
							class="h-fit w-[180px] border border-primary bg-white text-2xl text-black hover:bg-gray-100"
							>Save</Button
						>
					</div>

					<DateLabel class="mx-6 mt-6 justify-between" />
				</div>
			</form>
		</section>
	</div>
</main>
<!-- <form method="POST" onsubmit={beforeSubmit}>
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
</form> -->

<!-- <style>
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
</style> -->
