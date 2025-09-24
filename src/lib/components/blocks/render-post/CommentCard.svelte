<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import { getUserInitials } from '$lib/utils';
	import type { User, Comment } from '@prisma/client';
	import PostDate from '$lib/components/blocks/render-post/PostDate.svelte';

	type CommentWithUser = Comment & { user: User | null };

	let { commentData }: { commentData: Partial<CommentWithUser> } = $props();

	let relativeDate = $derived(commentData.user?.createdAt ? new Date(commentData.user.createdAt).toLocaleString('default', {month: 'long', year: 'numeric'}) : new Date().toLocaleString('default', {month: 'long', year: 'numeric'}));
</script>

<article
	class="items-top flex w-full flex-row gap-4 border-b border-gray-200 p-4 dark:border-gray-700"
>
	<Avatar class="rounded-full border border-gray-500 px-2 py-2 ring-gray-500 dark:text-black w-[50px] h-[50px] mx-3">{commentData ? getUserInitials(commentData?.user?.name ?? 'U') : 'U'}</Avatar>
	<div class="flex flex-col gap-2">
		<div class="flex flex-col">
			<p class="text-sm font-semibold text-gray-900">{commentData.user ? commentData.user.name : 'Unknown User'}</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">Joined in {relativeDate}</p>
		</div>
		<p class="text-gray-500 dark:text-gray-400">
			{commentData ? commentData.body : 'No comment provided.'}
		</p>
		<PostDate date={commentData?.createdAt ?? new Date()} className="text-sm text-gray-400 font-normal" />
	</div>
</article>
