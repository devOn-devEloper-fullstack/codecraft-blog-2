<script lang="ts">
	// Svelte 5
	let { data } = $props();
	const { posts } = data;

	const dateFmt: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	};

	function fmtDate(iso: string | null) {
		if (!iso) return '';
		const d = new Date(iso);
		return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, dateFmt);
	}
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Latest posts" />
</svelte:head>

<section class="container">
	<header class="header">
		<h1>Blog</h1>
		<a class="new" href="/me/posts/create">New post</a>
	</header>

	{#if posts?.length}
		<ul class="grid">
			{#each posts as post (post.id)}
				<li class="card">
					<a class="title" href={`/blog/${post.slug}`}>{post.postTitle}</a>

					{#if post.excerpt}
						<p class="excerpt">{post.excerpt}</p>
					{/if}

					{#if post.tags?.length}
						<div class="tags">
							{#each post.tags as t (t)}
								<span class="tag">{t}</span>
							{/each}
						</div>
					{/if}

					<div class="meta">
						<span>{post.User?.name ?? 'Unknown author'}</span>
						{#if post.publishedAt}
							<span>•</span>
							<time datetime={post.publishedAt as unknown as string}
								>{fmtDate(post.publishedAt as unknown as string)}</time
							>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="empty">
			<p>No posts yet.</p>
			<a href="/me/posts/create" class="cta">Create your first post</a>
		</div>
	{/if}
</section>

<style>
	.container {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	h1 {
		margin: 0;
		font-size: 2rem;
	}
	.new {
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
	}
	.grid {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 1rem;
	}
	.card {
		border: 1px solid #e5e5e5;
		border-radius: 0.75rem;
		padding: 1rem;
		background: #fff;
		display: grid;
		gap: 0.5rem;
	}
	.title {
		font-weight: 600;
		font-size: 1.125rem;
		text-decoration: none;
		color: inherit;
	}
	.excerpt {
		margin: 0.25rem 0 0;
		color: #444;
	}
	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}
	.tag {
		background: #f3f4f6;
		border: 1px solid #e5e7eb;
		padding: 0.125rem 0.5rem;
		border-radius: 999px;
		font-size: 0.85rem;
	}
	.meta {
		color: #555;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.empty {
		text-align: center;
		padding: 3rem 1rem;
		border: 2px dashed #e5e5e5;
		border-radius: 0.75rem;
		background: #fafafa;
	}
	.cta {
		display: inline-block;
		margin-top: 0.5rem;
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
	}
</style>
