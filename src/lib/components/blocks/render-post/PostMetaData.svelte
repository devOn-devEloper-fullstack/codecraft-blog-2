<script lang="ts">
	import { Drawer } from 'flowbite-svelte';
	import { getDrawerState, setDrawerState } from './renderPostState.svelte';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { formSchema } from '$lib/schemas/post-metadata';
	import { Input } from '$lib/components/ui/input';
	import SlugField from '../SlugField.svelte';
	import TagInput from '../TagInput.svelte';
	import { Button } from '$lib/components/ui/button';

	/** Properties **/
	let { metadata } = $props();

	/** State Declarations **/
	let open = $state(true);

	/** Sveltekit Superforms **/
	let formCreate = $derived(
		superForm(metadata.form, {
			validators: zod4Client(formSchema),
			dataType: 'json'
		})
	);

	let formData = $derived(formCreate.form);
	let errors = $derived(formCreate.errors);
	let enhance = $derived(formCreate.enhance);

	async function onSubmit(event: Event) {
		event.preventDefault();
		formCreate.submit();

		const formSubmitData = {
			postTitle: $formData.postTitle,
			slug: $formData.slug,
			excerpt: $formData.excerpt,
			tags: $formData.tags
		};

		try {
			const response = await fetch(`http://localhost:5173/api/posts/${metadata.form.id}/meta`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formSubmitData)
			});

			if (!response.ok) {
				throw new Error('Failed to submit');
			}

			const result = await response.json();
			console.log('Success:', result);
		} catch (e) {
			console.error('⛔ Error:', e);
		}
	}
</script>

<Drawer bind:open={getDrawerState, setDrawerState} placement="left">
	
	<form onsubmit={() => onSubmit}>
		<h3 class="mb-2 text-3xl font-bold text-black">Edit Post Metadata</h3>
		<p class="text-md mb-4 text-gray-400">
			Update the fields below to change the metadata related to your post.
		</p>
		<div class="mx-6 flex flex-col space-y-8">
			<Form.Field form={formCreate} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Post Title</Form.Label>
						<Input
							{...props}
							bind:value={$formData.postTitle}
							placeholder="Enter a title for your post"
							name="title-input"
						/>
						<input
							bind:value={$formData.postTitle}
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
						<SlugField bind:title={$formData.postTitle} bind:slug={$formData.slug} />
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
		</div>
		<Button type="submit" size="lg" class="mt-6 ml-6 text-xl">Update</Button>
	</form>
</Drawer>
