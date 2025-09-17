<script lang="ts">
	import PostTitle from '$lib/components/blocks/render-post/PostTitle.svelte';
	import PostAuthor from '$lib/components/blocks/render-post/PostAuthor.svelte';
	import PostDate from '$lib/components/blocks/render-post/PostDate.svelte';
	import PostTags from '$lib/components/blocks/render-post/PostTags.svelte';
	import { Avatar } from 'flowbite-svelte';
	import PostSocialShare from './PostSocialShare.svelte';
	import PostVitals from './PostVitals.svelte';

	/** Properties **/
	let { 
		title, 
		author, 
		slug, 
		date, 
		tags, 
		likes, 
		views, 
		comments,
		id
	}: 
		{ 
			title: string; 
			author: string; 
			slug: string; 
			date: Date; 
			tags: string[]; 
			likes: bigint; 
			views: bigint; 
			comments: bigint;
			id: string;
		} =
		$props();
	
	function getUserInitials(name: string): string {
		const names = name.split(' ');
		if (names.length === 1) return names[0].charAt(0).toUpperCase();
		return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
	}
</script>

<header class="relative mt-15 mb-10 flex h-fit w-[100vw] flex-col items-center gap-4">
	<PostTitle {title} />
	<div class="flex flex-row gap-2 items-center">
		<Avatar class="rounded-full border border-gray-500 px-2 py-2 ring-gray-500 dark:text-black w-[50px] h-[50px] mx-3"
					>{getUserInitials(author)}</Avatar>
		<PostAuthor {author} />
		<span class="px-3 text-2xl text-gray-400">|</span>
		<PostDate {date} />
	</div>
	<PostTags {tags} />
	<div class="flex flex-row gap-3 items-center justify-center">
		<PostSocialShare {slug} {title} />
		<PostVitals {likes} {views} {comments} {id}/>
	</div>
	
</header>
