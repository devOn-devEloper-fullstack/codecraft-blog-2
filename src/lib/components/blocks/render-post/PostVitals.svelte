<script lang="ts">
    import { HeartSolid, HeartOutline } from 'flowbite-svelte-icons'
    import Eye from 'phosphor-svelte/lib/Eye';
    import ChatCircle from 'phosphor-svelte/lib/ChatCircle';
	import { onMount } from 'svelte';
    import { getToastState } from '$lib/components/blocks/toast/toastState.svelte';


    let { likes = 0n, views = 0n, comments = 0n, id }: { likes: bigint, views: bigint, comments: bigint, id: string } = $props();

    let likeCount = $derived(Number(likes));
    
    let liked = $state(false);

    let toastState = getToastState();

    async function increment() {
        if (liked) return;
        likeCount += 1
        liked = true;

        try {
            const res = await fetch(`/api/posts/${id}/likes`, {
                method: 'POST'
            });

            if (res.ok) {
                toastState.add('Post Liked!', 'You have liked this post.', 'success');
            } else {
                toastState.add('Error', 'Failed to like the post. Please try again.', 'error');
                decrement();
            }
        } catch (err) {
            console.error('Error liking the post:', err);
            decrement();
        }
    }

    function decrement() {
        if (!liked) return;
        liked = false
        likeCount -= 1

        try {
            fetch(`/api/posts/${id}/likes`, {
                method: 'DELETE'
            });
        } catch (err) {
            console.error('Error unliking the post:', err)
        }
    }

    onMount(async () => {
        try {
            const response = await fetch(`/api/posts/${id}/likes/status`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                liked = data.liked;
            } else {
                console.error('Failed to fetch like status:', response.statusText);
            }
        } catch (err) {
            console.error('Error fetching like status:', err);
        }
    });
</script>

<div class="flex items-center gap-2 mt-4">
    {#if liked}
        <HeartSolid class="shrink-0 h-8 w-8 text-red-500 fill-red-500" onclick={() => decrement()} style="cursor: pointer;"/>
    {:else}
        <HeartOutline class="shrink-0 h-8 w-8 text-gray-700" onclick={() => increment()} style="cursor: pointer;"/>
    {/if}
    <span class="text-lg text-gray-700">{likeCount} Likes</span>
</div>

<div class="flex items-center gap-2 mt-4">
    <Eye size={32} class="text-gray-700"/>
    <span class="text-lg text-gray-700">{views} Views</span>
</div>

<div class="flex items-center gap-2 mt-4">
    <ChatCircle size={32} class="text-gray-700"/>
    <span class="text-lg text-gray-700">{comments} Comments</span>
</div>
