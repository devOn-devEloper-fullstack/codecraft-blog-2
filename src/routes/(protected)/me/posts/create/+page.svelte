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
	import { formSchema } from './schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';

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

			<!-- <RichEditor
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
