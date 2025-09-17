<script lang="ts">
    import FacebookLogo from 'phosphor-svelte/lib/FacebookLogo';
    import XLogo from 'phosphor-svelte/lib/XLogo';
    import LinkedinLogo from 'phosphor-svelte/lib/LinkedinLogo';
    import ThreadsLogo from 'phosphor-svelte/lib/ThreadsLogo';
    
    let { slug, title }: { slug: string, title: string } = $props();
</script>

<div class="flex flex-row gap-4 mt-4 border-r-2 border-gray-400 pr-4">
    <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("http://localhost:5173/posts/"+slug)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        class="text-black hover:text-blue-800 transition-colors"
    >
        <FacebookLogo size={32} />
    </a>
    <a
        href={`https://x.com/intent/tweet?url=${encodeURIComponent("http://localhost:5173/posts/"+slug)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (formerly Twitter)"
        class="text-black hover:text-blue-600 transition-colors"
    >
        <XLogo size={32} />
    </a>
    <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent("http://localhost:5173/posts/"+slug)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        class="text-black hover:text-blue-900 transition-colors"
    >
        <LinkedinLogo size={32} />
    </a>
    <a
        href={`https://www.threads.net/share?url=${encodeURIComponent("http://localhost:5173/posts/"+slug)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Threads"
        class="text-black hover:text-gray-800 transition-colors"
    >
        <ThreadsLogo size={32} />
    </a>
</div>
