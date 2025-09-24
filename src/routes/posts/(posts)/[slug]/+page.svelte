<script lang="ts">
	import type { PageProps } from './$types';
	import ViewBeacon from '$lib/components/blocks/ViewBeacon.svelte';
	import { page } from '$app/state';
	import PostHeader from '$lib/components/blocks/render-post/PostHeader.svelte';
	import ContentContainer from '$lib/components/blocks/render-post/ContentContainer.svelte';
	import './parsed.css';
	import type { Posts, User, PostStats } from '@prisma/client';
	import PostSuggestions from '$lib/components/blocks/render-post/PostSuggestions.svelte';
	import CommentSection from '$lib/components/blocks/render-post/CommentSection.svelte';

	/** Type Definitions */
	type PostWithUser = Posts & { User: User | null; stats: PostStats | null };
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

	const suggestions = $derived(
		posts
			.filter((_, i) => i !== index)
			.sort(() => 0.5 - Math.random())
			.slice(0, 3)
			.map((post) => ({
				title: post.postTitle ?? 'Untitled Post',
				slug: post.slug ?? '',
				excerpt: post.excerpt ?? ''
			}))
	);

	let likeCount = $derived(posts[index].stats ? posts[index].stats.likeCount : 0);
	let viewCount = $derived(posts[index].stats ? posts[index].stats.viewCount : 0);
	let commentCount = $derived(posts[index].stats ? posts[index].stats.commentCount : 0);
</script>

<ViewBeacon endpoint={`/api/posts/${posts[index].id}/views`} />

<PostHeader
	title={posts[index].postTitle ?? 'Untitled Post'}
	author={posts[index].User?.name ?? ''}
	slug={posts[index].slug ?? ''}
	date={posts[index].updatedAt ?? new Date(0)}
	tags={posts[index].tags ?? []}
	likes={likeCount}
	views={viewCount}
	comments={commentCount}
	id={posts[index].id ?? ''}
/>

<ContentContainer content={posts[index].contentHtml ?? ''} />

<PostSuggestions {suggestions} />

<CommentSection formLoadData={data.form} userData={data.session?.user} postData={posts[index]} />
