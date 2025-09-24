<script lang="ts">
	import CommentAdd from '$lib/components/blocks/render-post/CommentAdd.svelte';
	import CommentCard from '$lib/components/blocks/render-post/CommentCard.svelte';
	import type { SuperValidated } from 'sveltekit-superforms/client';
	import type { User, Posts, Comment, PostStats } from '@prisma/client';
	import type { CommentFormData } from '$lib/types';

	type PostWithComments = Posts & { comments: Comment[]; stats: PostStats | null };

	let { formLoadData, userData, postData }: { formLoadData: CommentFormData; userData: Partial<User> | null; postData: Partial<PostWithComments> | null } = $props();
</script>

<section class="mx-auto my-10 w-[1000px]">
	<h2 class="mb-4 text-3xl font-bold" id="comments">Comments ({postData?.stats?.commentCount ?? 0})</h2>
	<CommentAdd {formLoadData} {userData} {postData}/>
	{#if postData?.comments && postData.comments.length > 0}
		{#each postData.comments as comment (comment.id)}
			<CommentCard commentData={comment} />
		{/each}
	{:else}
		<p class="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
	{/if}
</section>
