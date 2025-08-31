<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { DateLabel } from '$lib/components/ui/date';
	import SlugField from '$lib/components/blocks/SlugField.svelte';
	import TagInput from '$lib/components/blocks/TagInput.svelte';
	// import Editor from '@tinymce/tinymce-svelte';
	import { formSchema, imageUploadSchema } from './schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Modal, Toast } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import type { PostPictures } from '@prisma/client';
	import type { UserImageAPIData } from '$lib/types';
	import { slide } from 'svelte/transition';
	import { Circle } from 'svelte-loading-spinners';
	import { Pagination } from 'bits-ui';
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import CaretRight from 'phosphor-svelte/lib/CaretRight';
	import Editor from '$lib/components/blocks/editor/Editor.svelte';
	import EditorToolbar from '$lib/components/blocks/editor/EditorToolbar.svelte';

	let { data }: { data: PageData } = $props();

	let conf = {
		height: 500,
		menubar: false,
		plugins: [
			'advlist',
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'anchor',
			'searchreplace',
			'visualblocks',
			'code',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'preview',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | blocks | ' +
			'bold italic forecolor | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'removeformat | help'
	};

	/**
	 * Runes for Post Creation Form
	 */
	let value = $state('<p>This is the initial content of the editor</p>');

	let formCreate = $derived(
		superForm(data.form, {
			validators: zod4Client(formSchema),
			dataType: 'json'
		})
	);

	let formData = $derived(formCreate.form);
	let errors = $derived(formCreate.errors);

	$effect(() => {
		$formData.contentHtml = value;
	});

	/**
	 * Runes for Image Upload Form:
	 */

	let imageUpload = $derived(
		superForm(data.imageForm, {
			validators: zod4Client(imageUploadSchema),
			dataType: 'json'
		})
	);
	let files = <FileList>$state();

	let imageFormData = $derived(imageUpload.form);
	let imageEnhance = $derived(imageUpload.enhance);
	let imageMessage = $derived(imageUpload.message);
	let imageSubmitting = $derived(imageUpload.submitting);

	$effect(() => {
		if (files) {
			const fileArray = Array.from(files);
			$imageFormData.image = fileArray[0];
		}
	});

	function onSubmit() {
		const html = document
			.querySelector('iframe')
			?.contentDocument?.querySelector('body')?.innerHTML;
		$formData.contentHtml = html as unknown as string;
	}

	/**
	 * Modal State Runes
	 */
	let formModal = $state(false);
	let selectionModal = $state(false);
	let toastStatus = $state(false);

	let fetchData: UserImageAPIData | null;
	let myPage = $state(1);
	let limit = $state(6);
	let total = <UserImageAPIData['total']>$state(0);
	let items = <UserImageAPIData['images']>$state([]);

	async function fetchImageData() {
		try {
			const response = await fetch(`/api/images/me?page=${myPage}&limit=${limit}`);
			fetchData = await response.json();
			items = fetchData?.images;
			total = fetchData?.total;

			console.log(fetchData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function nextPage() {
		if (total && myPage * limit < total) {
			myPage++;
			fetchImageData();
		}
	}

	function prevPage() {
		if (myPage > 1) {
			myPage--;
			fetchImageData();
		}
	}

	function setPage(newPage: number) {
		myPage = newPage;
		fetchImageData();
	}

	function getPage() {
		return myPage;
	}

	$effect(() => {
		if ($imageMessage?.status === 'success') {
			console.log($imageMessage.status);
			imageUpload.reset();
			formModal = false;
			toastStatus = true;
			fetchImageData();
		}
	});

	let selectedImage = $state();

	function getSelectionImage(event: Event) {
		const target = event.currentTarget as HTMLElement;
		selectedImage = target.children[0].children[0].getAttribute('src') ?? '';
		selectionModal = false;

		console.log(selectedImage);
	}

	// }
</script>

<div class="mt-4 mb-2 grid h-[100vh] w-[calc(100vw-40px-16px-20px)] grid-cols-[1fr_1fr]">
	<div class="flex h-[100%] w-[100%] flex-col">
		<Toast dismissable={true} transition={slide} bind:toastStatus>
			{#snippet icon()}
				<CheckCircleSolid class="h-5 w-5" />
			{/snippet}
			Image was successfully uploaded.
		</Toast>
		<Card.Header><h1 class="text-4xl font-semibold">Create a blog post</h1></Card.Header>
		<Card.Description class="ml-8"
			>Fill out the fields below to create a blog post.</Card.Description
		>
		{#if $errors?._errors}
			<div class="mt-3 rounded-md text-red-700">
				{$errors?._errors}
			</div>
		{/if}
		<section>
			<form action="?/createPost" method="POST" onsubmit={onSubmit} id="post-creation">
				<div class="mx-6">
					<Form.Field form={formCreate} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Post Title</Form.Label>
								<Input
									{...props}
									bind:value={$formData.title}
									placeholder="Enter a title for your post"
									name="title-input"
								/>
								<input
									bind:value={$formData.title}
									type="text"
									name="title"
									placeholder="Write a title for your next blog post"
									hidden
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={formCreate} name="slug">
						<Form.Control>
							{#snippet children()}
								<Form.Label>Post Slug</Form.Label>
								<SlugField bind:title={$formData.title} bind:slug={$formData.slug} />
								<input
									bind:value={$formData.slug}
									type="text"
									name="slug"
									placeholder="Write a unique slug for your post"
									hidden
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={formCreate} name="excerpt">
						<Form.Control>
							{#snippet children()}
								<Form.Label>Post Excerpt</Form.Label>
								<Input
									bind:value={$formData.excerpt}
									type="text"
									name="excerpt"
									placeholder="Describe your post for your audience"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={formCreate} name="tags">
						<Form.Control>
							{#snippet children()}
								<Form.Label>Post Tags</Form.Label>
								<TagInput bind:tags={$formData.tags} />
								<input
									bind:value={$formData.tags}
									type="text"
									name="tags"
									placeholder="Separate your tags by commas"
									hidden
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="mb-4 ml-6 flex flex-col space-y-2">
					<span class="text-xl font-semibold">Images:</span>
					<button
						type="button"
						class="w-fit rounded-md bg-[var(--primary)] px-4 py-2 text-white"
						onclick={(e) => {
							e.preventDefault();
							formModal = true;
						}}>Add Images</button
					>
					<button
						type="button"
						class="w-fit rounded-md border border-[var(--primary)] px-4 py-2 text-black"
						onclick={(e) => {
							e.preventDefault();
							selectionModal = true;
						}}
						onmouseenter={fetchImageData}
					>
						Select from Gallery
					</button>
					{#if selectedImage}
						<span class="text-md ml-2 text-[var(--destructive)]">Image Selected</span>
					{/if}
				</div>
				<Modal form bind:open={formModal} class="h-[85vh] w-[35vw] rounded-xl">
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
								By clicking the add button below, your post will be saved so your image can be
								uploaded. Saving your post will not result in the post being posted to the platform.
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
											class="rounded-full border px-4 py-2 text-black file:mr-4 file:rounded-full file:bg-[var(--color-primary)] file:px-3 file:py-1 file:text-white"
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
											A placeholder is text that will render in place of your image while the
											content is being loaded. The provided placeholder should be informative,
											inclusive, and semantic.
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
										<p>
											Alternative text is an accessible way to describe an image for a screen
											reader.
										</p>
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
											If you would like for your image to be accompanied with a caption, the
											following field can be used to supply our systems with your caption.
										</p>
										<Input
											type="text"
											id="caption"
											name="caption"
											bind:value={$imageFormData.caption}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<button
								type="submit"
								class="mt-2 w-fit rounded-xl bg-[var(--color-primary)] px-2 py-1 text-xl text-white"
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
								formModal = false;
							}}>✕</button
						>
					</div>
				</Modal>
				<Modal bind:open={selectionModal} class="h-[80vh] w-[40vw] rounded-xl">
					<div class="flex flex-row justify-between">
						<div class="flex flex-col space-y-6">
							<h3 class="text-3xl font-bold text-black">Select an Image from the Gallery</h3>
							<div class="h-[45vh] w-fit">
								<div
									style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;"
								>
									{#each items as item, i}
										<button type="button" onclick={getSelectionImage}>
											<figure style="margin:0">
												<img
													src={item.url}
													alt={item.key}
													style="width:100%;height:auto;object-fit:cover;border-radius:8px;"
												/>
												<figcaption
													style="font-size:12px;color:#666;word-break:break-all;padding-top:4px;"
												>
													{#if item.caption}
														<strong>Image Caption:</strong>
														{item.caption}
													{:else}
														<strong>Image #{i}:</strong>
													{/if}
												</figcaption>
											</figure>
										</button>
									{/each}
								</div>
							</div>
							<Pagination.Root
								count={total ? total : 0}
								perPage={limit}
								bind:page={getPage, setPage}
							>
								{#snippet children({ pages, range })}
									<div class="my-8 flex items-center justify-center">
										<Pagination.PrevButton
											class="mr-[25px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-[var(--dark-10)] active:scale-[0.98] disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
											onclick={prevPage}
										>
											<CaretLeft class="size-6" />
										</Pagination.PrevButton>
										<div class="flex items-center gap-2.5">
											{#each pages as pageData (pageData.key)}
												{#if pageData.type === 'ellipsis'}
													<div class="text-[15px] font-medium text-foreground-alt select-none">
														...
													</div>
												{:else}
													<Pagination.Page
														page={pageData}
														class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium select-none hover:bg-dark-10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-selected:bg-foreground data-selected:text-background"
														onclick={() => setPage(pageData.value)}
													>
														{pageData.value}
													</Pagination.Page>
												{/if}
											{/each}
										</div>
										<Pagination.NextButton
											class="ml-[29px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-dark-10 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
											onclick={nextPage}
										>
											<CaretRight class="size-6" />
										</Pagination.NextButton>
									</div>
									<p class="text-center text-[13px] text-muted-foreground">
										Showing {range.start} - {range.end}
									</p>
								{/snippet}
							</Pagination.Root>
						</div>
						<button
							class="absolute end-5 rounded-full px-3 py-2 hover:bg-gray-300"
							onclick={(e) => {
								e.preventDefault();
								selectionModal = false;
							}}>✕</button
						>
					</div>
				</Modal>

				<div class="flex w-full flex-row items-center justify-between">
					<div class="mx-6 mt-6 flex w-[35%] flex-row justify-between gap-6">
						<Form.Button class="h-fit w-[180px] text-2xl " formaction="?/createPost"
							>Submit</Form.Button
						>
						<Button
							type="button"
							class="h-fit w-[180px] border border-[var(--primary)] bg-white text-2xl text-black hover:bg-gray-100"
							>Save</Button
						>
					</div>

					<DateLabel class="mx-6 mt-6 justify-between" />
				</div>
			</form>
		</section>
	</div>
	<div class="mt-20 h-[100%] w-[100%]">
		<div class="ml-6">
			<!-- <Editor apiKey="u2bmg51o325t8jlpn4tv96tpjb0w49740u1706xg7i6i8cgu" bind:value {conf} /> -->
			<Editor image={selectedImage as string} />

			<input bind:value={$formData.contentHtml} name="contentHtml" hidden />
		</div>
	</div>
</div>
