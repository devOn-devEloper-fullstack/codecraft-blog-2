<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { DateLabel } from '$lib/components/ui/date';
	import SlugField from '$lib/components/blocks/SlugField.svelte';
	import TagInput from '$lib/components/blocks/TagInput.svelte';
	import Editor from '@tinymce/tinymce-svelte';
	import { formSchema, imageUploadSchema } from './schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Modal } from 'flowbite-svelte';

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

	/**
	 * Runes for Post Creation Form
	*/
	let value = $state('<p>This is the initial content of the editor</p>');


	let form = $derived(
		superForm(data.form, {
			validators: zod4Client(formSchema),
			dataType: 'json'
		})
	);


	let formData = $derived(form.form);
	let errors = $derived(form.errors);

	$effect(() => {
		$formData.contentHtml = value;
	});

	/**
	 * Runes for Image Upload Form:
	*/

	let imageUpload = $derived(superForm(data.imageForm, {
		validators: zod4Client(imageUploadSchema),
		dataType: 'json'
	}))

	let imageFormData = $derived(imageUpload.form);
	let imageErrors = $derived(imageUpload.errors);


	function onSubmit(e: SubmitEvent) {
		const formElement = e.target as HTMLFormElement;
		// const title = formElement.querySelector('input[name="title-input"]') as HTMLInputElement;
		// const slug = formElement.querySelector('input[name="slug-input"]') as HTMLInputElement;
		// const tags = formElement.querySelector('input[name="tag-input"]') as HTMLInputElement;

		const html = document
			.querySelector('iframe')
			?.contentDocument?.querySelector('body')?.innerHTML;

		console.log(html);
		$formData.contentHtml = html as unknown as string;

		// console.log(title.value, slug.value, tags.value);
	}

	/**
	 * Modal State Runes
	*/
	let formModal = $state(false);
	let selectionModal = $state(false);

	// }
</script>

<SuperDebug data={$formData} />

<div class="mb-2 flex w-[50vw] flex-col gap-3">
	<Card.Header><h1 class="text-4xl font-semibold">Create a blog post</h1></Card.Header>
	<Card.Description class="ml-8">Fill out the fields below to create a blog post.</Card.Description>
	{#if $errors?._errors}
		<div class="mt-3 rounded-md text-red-700">
			{$errors?._errors}
		</div>
	{/if}
	<section>
		<form action="?/createPost" method="POST" onsubmit={onSubmit}>
			<div class="mx-6">
				<Form.Field {form} name="title">
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
				<Form.Field {form} name="slug">
					<Form.Control>
						{#snippet children()}
							<Form.Label>Post Slug</Form.Label>
							<SlugField bind:title={$formData.title} bind:slug={$formData.slug} />
							<input
								bind:value={$formData.slug}
								type="text"
								name="slug"
								placeholder="Write a unique slug for your post"
								hidden
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="excerpt">
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
				<Form.Field {form} name="tags">
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
			</div>
			<div class="mb-4 ml-6 flex flex-col space-y-2">
				<span class="text-xl font-semibold">Images:</span>
				<button
					type="button"
					class="w-fit rounded-md bg-[var(--color-primary)] px-4 py-2 text-white"
					onclick={() => (formModal = true)}>Add Images</button
				>
				<button
					type="button"
					class="w-fit rounded-md border border-[var(--color-primary)] px-4 py-2 text-black"
					onclick={() => (selectionModal = true)}
				>
					Select from Gallery
				</button>
			</div>
			<Modal form bind:open={formModal} class="h-[65vh] w-[30vw] rounded-xl">
				<div class="flex flex-row justify-between">
					<form action="?/uploadImage" method="POST" class="flex flex-col space-y-6">
						<h3 class="text-3xl font-bold text-black">Add a Post Image</h3>
						<p>
							By clicking the add button below, your post will be saved so your image can be
							uploaded. Saving your post will not result in the post being posted to the platform.
						</p>
						<Form.Field form={imageUpload} name="image">
							<Form.Control>
								{#snippet children()}
									<Form.Label>Select an image file</Form.Label>
									<Input type="file" id="image" name="image" accept="image/*" required bind:value={$imageUpload.image}/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<!-- <label class="flex flex-col space-y-2" for="image">
							<span class="text-xl font-semibold text-black"> Select an image file </span>
							<input
								type="file"
								id="image"
								name="image"
								class="w-[55%] rounded-full border border-black px-4 py-2 text-black file:mr-4 file:rounded-full file:bg-[var(--color-primary)] file:px-3 file:py-1 file:text-white"
								placeholder="Select an Image"
								accept="image/*"
								multiple
								required
							/>
						</label> -->
						<!-- <label class="flex flex-col space-y-2" for="placeholder">
							<span class="text-xl font-semibold text-black"> Placeholder </span>
							<p>
								A placeholder is text that will render in place of your image while the content is
								being loaded. The provided placeholder should be informative, inclusive, and
								semantic.
							</p>
							<input
								type="text"
								id="placeholder"
								name="placeholder"
								class="w-[55%] rounded-full border border-black px-2 py-2 text-black"
								placeholder="Enter your placeholder text"
							/>
						</label> -->
						<Form.Field form={imageUpload} name="placeholder">
							<Form.Control>
								{#snippet children()}
									<Form.Label>Placeholder</Form.Label>
									<p>
								A placeholder is text that will render in place of your image while the content is
								being loaded. The provided placeholder should be informative, inclusive, and
								semantic.
							</p>
									<Input type="text" id="placeholder" name="placeholder" bind:value={$imageUpload.placeholder}/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<!-- <label class="flex flex-col space-y-2" for="alt">
							<span class="text-xl font-semibold text-black"> Alternative Text </span>
							<p>Alternative Text is an accessible way to describe an image for a screen reader.</p>
							<input
								type="text"
								id="alt"
								name="alt"
								class="w-[55%] rounded-full border border-black px-2 py-2 text-black"
								placeholder="Enter your alternative text"
							/>
						</label> -->
						<Form.Field form={imageUpload} name="alt">
							<Form.Control>
								{#snippet children()}
									<Form.Label>Alternative Text</Form.Label>
									<p>Alternative Text is an accessible way to describe an image for a screen reader.</p>
									<Input type="text" id="alt" name="alt" bind:value={$imageUpload.alt}/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<!-- <label class="flex flex-col space-y-2" for="caption">
							<span class="text-xl font-semibold text-black">Image Caption</span>
							<p>
								If you would like for your image to be accompanied with a caption, the following
								field can be used to supply our systems with your caption.
							</p>
							<input
								type="text"
								id="caption"
								name="caption"
								class="w-[55%] rounded-full border border-black px-2 py-2 text-black"
								placeholder="Enter your caption"
							/>
						</label> -->
						<Form.Field form={imageUpload} name="caption">
							<Form.Control>
								{#snippet children()}
									<Form.Label>Image Caption</Form.Label>
									<p>
								If you would like for your image to be accompanied with a caption, the following
								field can be used to supply our systems with your caption.
							</p>
									<Input type="text" id="caption" name="caption" bind:value={$imageUpload.caption}/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<button
							type="submit"
							class="mt-2 w-[25%] rounded-xl bg-[var(--color-primary)] px-2 py-1 text-xl text-white"
							>Add Image</button
						>
					</form>
					<button
						class="absolute end-5 rounded-full px-3 py-2 hover:bg-gray-300"
						onclick={() => (formModal = false)}>✕</button
					>
				</div>
			</Modal>
			<Modal bind:open={selectionModal} class="h-[65vh] w-[30vw] rounded-xl">
				<div class="flex flex-row justify-between">
					<div class="flex flex-col space-y-6">
						<h3 class="text-3xl font-bold text-black">Select an Image from the Gallery</h3>
						e
					</div>
					<button
						class="absolute end-5 rounded-full px-3 py-2 hover:bg-gray-300"
						onclick={() => (selectionModal = false)}>✕</button
					>
				</div>
			</Modal>

			<!--
				<RichEditor
				bind:contentHtml={$formData.contentHtml}
				bind:contentJson={$formData.contentJson}
			/> -->
			<div class="ml-6">
				<Editor apiKey="u2bmg51o325t8jlpn4tv96tpjb0w49740u1706xg7i6i8cgu" bind:value {conf} />
				<input bind:value={$formData.contentHtml} name="contentHtml" hidden />
			</div>

			<div class="flex w-full flex-row items-center justify-between">
				<div class="mx-6 mt-6 flex w-[35%] flex-row justify-between gap-6">
					<Form.Button class="h-fit w-[180px] text-2xl" formaction="?/createPost"
						>Submit</Form.Button
					>
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
