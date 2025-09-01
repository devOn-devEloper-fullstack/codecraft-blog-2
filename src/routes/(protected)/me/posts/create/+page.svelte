<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import { Toast } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';
	import PostForm from '$lib/components/blocks/post-creation/PostForm.svelte';
	import {
		getToastStatus,
		setToastStatus,
		toggleToastStatusState
	} from '$lib/components/blocks/post-creation/state.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="mt-4 mb-2 h-[100vh] w-[calc(100vw-40px-16px-20px)]">
	<div class="flex h-[100%] w-[100%] flex-col">
		<div class="flex w-[100%] justify-center">
			<Toast
				dismissable={true}
				transition={slide}
				bind:toastStatus={getToastStatus, setToastStatus}
				class="w-[500px]"
			>
				{#snippet icon()}
					<CheckCircleSolid class="h-5 w-5" fill="#2c6e49" />
				{/snippet}
				<span class="text-lg font-semibold text-[var(--success)]"
					>Image was successfully uploaded.</span
				>
			</Toast>
		</div>
		<Card.Header><h1 class="text-4xl font-semibold">Create a blog post</h1></Card.Header>
		<Card.Description class="ml-8"
			>Fill out the fields below to create a blog post.</Card.Description
		>
		<!-- {#if $errors?._errors}
			<div class="mt-3 rounded-md text-red-700">
				{$errors?._errors}
			</div>
		{/if} -->
		<section>
			<PostForm {data} />
		</section>
	</div>
	<div class="mt-20 h-[100%] w-[100%]">
		<div class="ml-6"></div>
	</div>
</div>
