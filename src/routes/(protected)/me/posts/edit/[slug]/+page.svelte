<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Editor from '$lib/components/blocks/editor/Editor.svelte';
	import PostTitle from '$lib/components/blocks/render-post/PostTitle.svelte';
	import PostAuthor from '$lib/components/blocks/render-post/PostAuthor.svelte';
	import PostDate from '$lib/components/blocks/render-post/PostDate.svelte';
	import PostTags from '$lib/components/blocks/render-post/PostTags.svelte';
	import './parsed.css';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { getEditorState } from '$lib/components/blocks/post-creation/state.svelte';
	import { formSchema } from './formSchema';
	import { Button } from '$lib/components/ui/button';
	import { setDrawerState } from '$lib/components/blocks/render-post/renderPostState.svelte';
	import PostMetaData from '$lib/components/blocks/render-post/PostMetaData.svelte';

	/** Properties **/
	let { data }: PageProps = $props();

	/** Sveltekit Superforms **/
	let formCreate = $derived(
		superForm(data.form, {
			validators: zod4Client(formSchema),
			dataType: 'json'
		})
	);

	let formData = $derived(formCreate.form);
	let errors = $derived(formCreate.errors);

	let index = $derived(data.posts.findIndex((post) => post.slug === page.params.slug));
	let propData = $derived.by(() => {
		return {
			form: data.posts[index]
		};
	});

	$inspect(propData);

	let editing = $state(false);

	function toggleEditState() {
		editing = editing === false ? true : false;
	}

	async function onSubmit(event: Event) {
		event.preventDefault();

		$formData.contentHtml = getEditorState()?.getHTML() ?? '';
		$formData.contentJson = getEditorState()?.getJSON() ?? '';

		const formSubmitData = {
			contentHtml: $formData.contentHtml,
			contentJson: $formData.contentJson
		};

		try {
			const response = await fetch(`http://localhost:5173/api/posts/${data.posts[index].id}`, {
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

<header class="relative mt-4 flex h-fit w-[calc(100vw-40px-70px)] flex-col items-center gap-4">
	<PostTitle title={data.posts[index].postTitle} />
	<div>
		<PostAuthor author={data.posts[index].User?.name ?? ''} />
		<span class="px-3 text-2xl text-gray-400">|</span>
		<PostDate date={data.posts[index].updatedAt} />
	</div>
	<PostTags tags={data.posts[index].tags} />
	<button
		type="button"
		class="absolute top-0 right-0 rounded-lg bg-[var(--primary)] px-3 py-2 text-xl text-white hover:bg-[var(--primary-500)]"
		disabled={editing}
		onclick={toggleEditState}>Edit Post</button
	>
	<button
		type="button"
		class="absolute top-15 right-0 rounded-lg bg-[var(--primary)] px-3 py-2 text-xl text-white hover:bg-[var(--primary-500)]"
		onclick={() => setDrawerState(true)}
	>
		Edit Metadata
	</button>

	<PostMetaData metadata={propData} />
</header>

{#if editing}
	<form onsubmit={onSubmit}>
		<Editor
			image={null}
			content={data.posts[index].contentHtml}
			bind:htmlContent={$formData.contentHtml}
			bind:jsonContent={$formData.contentJson}
		/>
		<Button type="submit" size="lg" class="text-xl">Save Draft</Button>
	</form>
{:else}
	<div class="post-body">{@html data.posts[index].contentHtml}</div>
{/if}
