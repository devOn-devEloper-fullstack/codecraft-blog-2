<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	console.log(data);
</script>

<h2 class="px-6 py-2 text-4xl font-bold">User Image Gallery</h2>
<p class="w-[50%] px-6 py-2 text-lg">
	These images have been added through various posts interfaces. New images can be added <a
		href="/me/posts/create"
		class="cursor-pointer font-semibold text-[var(--primary-500)] underline">here.</a
	> Any image that is not associated with a post can be deleted by selecting the delete button in the
	top right-hand corner of the image.
</p>

{#if data.images}
	<div class="grid h-[100vh] w-[calc(100vw-24px-60px)] grid-cols-[1fr_1fr_1fr_1fr] gap-5 px-6">
		{#each data.images.images as image}
			<img
				src={image.url}
				alt={image.alt}
				style="width:100%;height:auto;object-fit:cover;border-radius:8px;"
			/>
		{/each}
	</div>
{:else}
	<span class="p-2 text-2xl font-semibold text-[var(--destructive)]"
		>No data returned from fetch.</span
	>
{/if}
