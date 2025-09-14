<script lang="ts">
	import type { PageProps } from './$types';
	import ViewBeacon from '$lib/components/blocks/ViewBeacon.svelte';
	import { page } from '$app/state';
	import PostTitle from '$lib/components/blocks/render-post/PostTitle.svelte';
	import PostAuthor from '$lib/components/blocks/render-post/PostAuthor.svelte';
	import PostDate from '$lib/components/blocks/render-post/PostDate.svelte';
	import PostTags from '$lib/components/blocks/render-post/PostTags.svelte';
	import './parsed.css';

	/** Properties **/
	let { data }: PageProps = $props();

	console.log(data.posts.posts)

	let index = $derived(data.posts.posts.findIndex((post) => post.slug === page.params.slug));

	$inspect(index)
</script>


<ViewBeacon endpoint={`/api/posts/${data.posts.posts[index].id}/views`} />

<header
	class="relative mt-15 mb-10 flex h-fit w-[100vw] flex-col items-center gap-4"
>
	<PostTitle title={data.posts.posts[index].postTitle} />
	<div>
		<PostAuthor author={data.posts.posts[index].User?.name ?? ''} />
		<span class="px-3 text-2xl text-gray-400">|</span>
		<PostDate date={data.posts.posts[index].updatedAt} />
	</div>
	<PostTags tags={data.posts.posts[index].tags} />
</header>

<div class="mx-auto px-8 py-4 w-[800px] h-[60vh] justify-center shadow-lg rounded-2xl text-center ring-1 ring-gray-400 text-xl">{@html data.posts.posts[index].contentHtml}</div>
