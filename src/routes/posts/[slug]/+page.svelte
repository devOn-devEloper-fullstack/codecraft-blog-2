<script lang="ts">
	import type { PageProps } from './$types';
	import ViewBeacon from '$lib/components/blocks/ViewBeacon.svelte';
	import { page } from '$app/state';

	/** Properties **/
	let { data }: PageProps = $props();

	let index = $derived(data.posts.findIndex((post) => post.slug === page.params.slug));
</script>

<ViewBeacon endpoint={`/api/posts/${data.posts[index].id}/views`} />

<h2 class="text-2xl font-bold">{data.posts[index].title}</h2>
<p>
	By {data.posts[index].author.name} on {new Date(data.posts[index].createdAt).toLocaleDateString()}
</p>
<div>{@html data.posts[index].contentHtml}</div>
