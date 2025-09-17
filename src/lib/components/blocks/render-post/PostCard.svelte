<script lang="ts">
    let { title = '', slug = '', excerpt = '' }: { title: string; slug: string; excerpt: string; } = $props();

</script>

<article class="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 min-h-[300px] max-h-[400px] w-[300px]">
    <a href={`/posts/${slug}`} class="text-xl font-semibold text-[var(--primary)] hover:underline">
        {title}
    </a>
    <p class="mt-2 text-gray-600 text-md">{excerpt}</p>
</article>