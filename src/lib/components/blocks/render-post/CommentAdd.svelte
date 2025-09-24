<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Avatar } from 'flowbite-svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { commentSchema } from '$lib/schemas/comment-schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import type { SuperValidated } from 'sveltekit-superforms/client';
	import type { User, Posts } from '@prisma/client';
	import { getUserInitials } from '$lib/utils';
	import type { CommentFormData } from '$lib/types';
	import SuperDebug from 'sveltekit-superforms'

	/** Properties */

	let { 
			formLoadData, 
			userData,
			postData 
		}: 
		{ 
			formLoadData: CommentFormData; 
			userData: Partial<User> | null;
			postData: Partial<Posts> | null
	} = $props();

	let relativeDate = $derived(userData?.createdAt ? new Date(userData.createdAt).toLocaleString('default', {month: 'long', year: 'numeric'}) : new Date().toLocaleString('default', {month: 'long', year: 'numeric'}));

	let superform = $derived(
		superForm(formLoadData, {
			validators: zod4Client(commentSchema),
			dataType: 'json'
		})
	);

	let form = $derived(superform.form);
	let errors = $derived(superform.errors);
	let submitting = $derived(superform.submitting);
	let enhance = $derived(superform.enhance);

	function onFormSubmit() {
		$form.postId = postData?.id ?? '';
	}

</script>



<!-- Refactor to CommentCard component -->
<article
	class="items-top flex w-full flex-row gap-4 border-b border-gray-200 p-4 dark:border-gray-700"
>
	<Avatar class="rounded-full border border-gray-500 px-2 py-2 ring-gray-500 dark:text-black w-[50px] h-[50px] mx-3"
				>{userData ? getUserInitials(userData.name ?? 'U') : 'U'}</Avatar>
	<div class="flex w-full flex-col gap-2">
		<div class="flex flex-col">
			<p class="text-sm font-semibold text-gray-900">{userData ? userData.name : 'Unknown User'}</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">Joined in {relativeDate}</p>
		</div>
		<form use:enhance class="flex w-full flex-col gap-2" onsubmit={() => onFormSubmit()} action="?/addComment" method="POST">
			<Form.Field name="comment" form={superform}>
				<Form.Control>
					{#snippet children()}
						<Form.Label>Add a comment</Form.Label>
						<Input
							type="text"
							name="comment"
							placeholder="Add a comment..."
							bind:value={$form.comment}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Input type="text" name="postId" value={postData?.id ?? ''} hidden />
			<Form.Button
				type="submit"
				disabled={$submitting}
				formaction="?/addComment"
				class="w-fit rounded-md bg-[var(--primary)] px-4 py-2 text-white hover:bg-[var(--primary-500)]"
				>{$submitting ? 'Submitting...' : 'Submit'}</Form.Button
			>

			{#if $errors?._errors}
				<div class="mt-3 rounded-md text-red-700">
					{$errors?._errors}
				</div>
			{/if}
		</form>
	</div>
</article>
