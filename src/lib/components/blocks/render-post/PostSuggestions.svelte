<script lang="ts">
	import PostCard from '$lib/components/blocks/render-post/PostCard.svelte';

	let {
		suggestions = []
	}: { suggestions: Array<{ title: string; slug: string; excerpt: string }> } = $props();
</script>

{#if suggestions.length > 0}
	<section class="mx-auto my-10 w-[1000px]">
		<h2 class="mb-4 text-3xl font-bold">You might also like</h2>
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each suggestions as { title, slug, excerpt }}
				<PostCard {title} {slug} {excerpt} />
			{/each}
		</div>
	</section>
{/if}

