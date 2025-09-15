<script lang="ts">
	import PostTitle from '$lib/components/blocks/render-post/PostTitle.svelte';
	import PostAuthor from '$lib/components/blocks/render-post/PostAuthor.svelte';
	import PostDate from '$lib/components/blocks/render-post/PostDate.svelte';
	import PostTags from '$lib/components/blocks/render-post/PostTags.svelte';

	/** Properties **/
	let { title, author, date, tags }: { title: string; author: string; date: Date; tags: string[] } =
		$props();
</script>

<header class="relative mt-15 mb-10 flex h-fit w-[100vw] flex-col items-center gap-4">
	<PostTitle {title} />
	<div>
		<PostAuthor {author} />
		<span class="px-3 text-2xl text-gray-400">|</span>
		<PostDate {date} />
	</div>
	<PostTags {tags} />
</header>
