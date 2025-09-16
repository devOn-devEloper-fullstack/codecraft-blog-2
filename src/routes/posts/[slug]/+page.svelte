<script lang="ts">
	import type { PageProps } from './$types';
	import ViewBeacon from '$lib/components/blocks/ViewBeacon.svelte';
	import { page } from '$app/state';
	import PostHeader from '$lib/components/blocks/render-post/PostHeader.svelte';
	import ContentContainer from '$lib/components/blocks/render-post/ContentContainer.svelte';
	// import './parsed.css';
	import type { Posts, User } from '@prisma/client';

	/** Type Definitions */
	type PostWithUser = Posts & { User: User | null };
	type PostsAPIResponse = {
		page: number;
		limit: number;
		total: number;
		posts: Partial<PostWithUser>[] | [];
	};

	/** Properties **/
	let { data }: PageProps = $props();

	/** State Declarations **/
	let posts = $derived(data.posts.posts as Partial<PostWithUser>[] | []);

	let index = $derived(posts.findIndex((post) => post.slug === page.params.slug));
</script>

<ViewBeacon endpoint={`/api/posts/${posts[index].id}/views`} />

<PostHeader
	title={posts[index].postTitle ?? 'Untitled Post'}
	author={posts[index].User?.name ?? ''}
	slug={posts[index].slug ?? ''}
	date={posts[index].updatedAt ?? new Date(0)}
	tags={posts[index].tags ?? []}
/>

<ContentContainer content={posts[index].contentHtml ?? ''} />
