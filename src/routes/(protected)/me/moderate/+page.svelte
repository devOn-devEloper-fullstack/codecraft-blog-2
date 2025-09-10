<script lang="ts">
	import type { PageProps } from "../$types";

    let { data }: PageProps = $props();

    let tasks = $derived(data.tasks);
    let claimed = $derived(data.claimed);



</script>
<div class="p-4 min-w-[80vw]">
<h2 class="text-2xl font-bold">Moderation Tasks</h2>
{#if tasks.length === 0}
    <p class="mt-4">No moderation tasks available.</p>
{:else}
    <ul class="mt-4 space-y-4">
        {#each tasks as task}
            <li class="border p-4 rounded-lg shadow-sm">
                <h3 class="text-xl font-semibold">{task.post.postTitle}</h3>
                <p class="mt-2">Flag Reason: {task.reason}</p>
                <p class="mt-2">{@html task.post.contentHtml}</p>
                <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Claim Task</button>
            </li>
        {/each}
    </ul>
{/if}
<h2 class="text-2xl font-bold mt-4">Claimed Moderation Tasks</h2>
{#if claimed.length === 0}
    <p class="mt-4">No claimed moderation tasks.</p>
{:else}
    <ul class="mt-4 space-y-4">
        {#each claimed as task}
            <li class="border p-4 rounded-lg shadow-sm">
                <h3 class="text-xl font-semibold">{task.post.postTitle}</h3>
                <p class="mt-2">Flag Reason: {task.reason.substring(12)}</p>
                <p class="mt-2">{@html task.post.contentHtml}</p>
                <button class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Resolve Task</button>
            </li>
        {/each}
    </ul>
{/if}
</div>

