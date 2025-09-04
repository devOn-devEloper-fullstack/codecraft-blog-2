<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import hljs from 'highlight.js';
	import './parsed.css';

	let { data }: PageProps = $props();

	let index = $derived(data.posts.findIndex((post) => post.slug === page.params.slug));

	const syntax = hljs.highlight(data.posts[index].contentHtml, { language: 'xml' }).value;

	console.log(data);
</script>

<h2 class="w-[80vw] text-2xl font-bold">Post Title: {data.posts[index].postTitle}</h2>
<blockquote>{data.posts[index].excerpt}</blockquote>
<span>{data.posts[index].tags}</span>
<div>{@html syntax}</div>
