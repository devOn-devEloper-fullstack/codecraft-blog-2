<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Modal } from 'flowbite-svelte';
	import {
		getFormModalState,
		toggleFormModalState,
		fetchImageData,
		toggleToastStatusState,
		setFormModalState
	} from './state.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { imageUploadSchema } from '../../../../routes/(protected)/me/posts/create/schema';
	import { Circle } from 'svelte-loading-spinners';

	/** Component Properties **/
	let { data } = $props();

	/** Sveltekit Superforms **/
	let imageUpload = $derived(
		superForm(data.imageForm, {
			validators: zod4Client(imageUploadSchema),
			dataType: 'json'
		})
	);

	let imageFormData = $derived(imageUpload.form);
	let imageEnhance = $derived(imageUpload.enhance);
	let imageMessage = $derived(imageUpload.message);
	let imageSubmitting = $derived(imageUpload.submitting);

	$effect(() => {
		if ($imageMessage?.status === 'success') {
			console.log($imageMessage.status);
			imageUpload.reset();
			toggleFormModalState();
			toggleToastStatusState();
			fetchImageData();
		}
	});

	/** File Upload State **/
	let files = <FileList>$state();

	$effect(() => {
		if (files) {
			const fileArray = Array.from(files);
			$imageFormData.image = fileArray[0];
		}
	});
</script>

<Modal form bind:open={getFormModalState, setFormModalState} class="h-[85vh] w-[35vw] rounded-xl">
	<div class="flex flex-row justify-between">
		<form
			action="?/uploadImage"
			method="POST"
			class="flex flex-col space-y-6"
			id="image-upload"
			use:imageEnhance
			enctype="multipart/form-data"
		>
			<h3 class="text-3xl font-bold text-black">Add a Post Image</h3>
			<p>
				By clicking the add button below, your post will be saved so your image can be uploaded.
				Saving your post will not result in the post being posted to the platform.
			</p>
			<Form.Field form={imageUpload} name="image">
				<Form.Control>
					{#snippet children()}
						<Form.Label class="text-black">Select an image file</Form.Label>
						<Input
							type="file"
							id="image"
							name="image"
							accept="image/*"
							required
							bind:files
							class="rounded-full border px-4 py-2 text-black file:mr-4 file:rounded-full file:bg-[var(--primary)] file:px-3 file:py-1 file:text-white"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field form={imageUpload} name="placeholder">
				<Form.Control>
					{#snippet children()}
						<Form.Label class="text-black">Placeholder</Form.Label>
						<p>
							A placeholder is text that will render in place of your image while the content is
							being loaded. The provided placeholder should be informative, inclusive, and semantic.
						</p>
						<Input
							type="text"
							id="placeholder"
							name="placeholder"
							bind:value={$imageFormData.placeholder}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field form={imageUpload} name="alt">
				<Form.Control>
					{#snippet children()}
						<Form.Label class="text-black">Alternative Text</Form.Label>
						<p>Alternative text is an accessible way to describe an image for a screen reader.</p>
						<Input type="text" id="alt" name="alt" bind:value={$imageFormData.alt} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field form={imageUpload} name="caption">
				<Form.Control>
					{#snippet children()}
						<Form.Label class="text-black">Image Caption</Form.Label>
						<p>
							If you would like for your image to be accompanied with a caption, the following field
							can be used to supply our systems with your caption.
						</p>
						<Input type="text" id="caption" name="caption" bind:value={$imageFormData.caption} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<button
				type="submit"
				class="mt-2 w-fit rounded-xl bg-[var(--primary)] px-2 py-1 text-xl text-white"
				formaction="?/uploadImage"
				disabled={$imageSubmitting}
			>
				{#if $imageSubmitting}
					<div class="flex w-fit flex-row items-center gap-2 px-2">
						<Circle color="#dc2626" size="20" unit="px" />
						<span class="text-l">Submitting ...</span>
					</div>
				{:else}
					Add Image
				{/if}
			</button>
		</form>
		<button
			class="absolute end-5 rounded-full px-3 py-2 hover:bg-gray-300"
			onclick={(e) => {
				e.preventDefault();
				toggleFormModalState();
			}}>✕</button
		>
	</div>
</Modal>
