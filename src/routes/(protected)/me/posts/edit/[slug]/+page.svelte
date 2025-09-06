<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Editor from '$lib/components/blocks/editor/Editor.svelte';
	import PostTitle from '$lib/components/blocks/render-post/PostTitle.svelte';
	import PostAuthor from '$lib/components/blocks/render-post/PostAuthor.svelte';
	import PostDate from '$lib/components/blocks/render-post/PostDate.svelte';
	import PostTags from '$lib/components/blocks/render-post/PostTags.svelte';
	import './parsed.css';

	let { data }: PageProps = $props();

	let index = $derived(data.posts.findIndex((post) => post.slug === page.params.slug));

	let editing = $state(false);

	function toggleEditState() {
		editing = editing === false ? true : false;
	}
</script>

<header class="relative mt-4 flex w-[calc(100vw-40px-70px)] flex-col items-center gap-4">
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
		onclick={toggleEditState}>Edit Post</button
	>
</header>

{#if editing}
	<Editor image={null} content={data.posts[index].contentHtml} />
{:else}
	<div class="post-body">{@html data.posts[index].contentHtml}</div>
{/if}
