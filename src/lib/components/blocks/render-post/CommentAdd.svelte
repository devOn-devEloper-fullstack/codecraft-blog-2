<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Avatar } from 'flowbite-svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { commentSchema } from '$lib/schemas/comment-schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { formLoadData } = $props();

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
</script>

<!-- Refactor to CommentCard component -->
<article
	class="items-top flex w-full flex-row gap-4 border-b border-gray-200 p-4 dark:border-gray-700"
>
	<Avatar src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" />
	<div class="flex w-full flex-col gap-2">
		<div class="flex flex-col">
			<p class="text-sm font-semibold text-gray-900">User Name</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">Joined in August 2021</p>
		</div>
		<form action="" use:enhance class="flex w-full flex-col gap-2">
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
			<Form.Button
				type="submit"
				disabled={$submitting}
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
