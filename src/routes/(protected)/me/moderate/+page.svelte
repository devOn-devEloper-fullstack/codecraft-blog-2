<script lang="ts">
	import type { PageProps } from "../$types";

    let { data }: PageProps = $props();

    console.log(data);

    let tasks = $derived(data.tasks);
    let claimed = $derived(data.claimed);

    let resolve = $state(false)


    async function onSubmit(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
        const formSubmitData = {
            taskId: (event.target as Element)?.closest('li')?.getAttribute('data-task-id'),
            status: formData.get('decision'),
            rationale: formData.get('rationale')
        }


		try {
			const response = await fetch(`http://localhost:5173/api/moderation/decisions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formSubmitData)
			});

			if (!response.ok) {
				throw new Error('Failed to submit');
			}

			const result = await response.json();
			console.log('Success:', result);
		} catch (e) {
			console.error('⛔ Error:', e);
		}
	}



</script>
<div class="p-4 min-w-[80vw]">
<h2 class="text-2xl font-bold">Moderation Tasks</h2>
{#if tasks.length === 0}
    <p class="mt-4">No moderation tasks available.</p>
{:else}
    <ul class="mt-4 space-y-4">
        {#each tasks as task}
            <li class="border p-4 rounded-lg shadow-sm">
                <h3 class="text-xl font-semibold">{task.post.postTitle ?? 'Untitled Post'}</h3>
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
        {#each claimed as task (task.id)}
            <li class="border p-4 rounded-lg shadow-sm" data-task-id={task.id}>
                <h3 class="text-xl font-semibold">{task.post.postTitle ?? 'Untitled Post'}</h3>
                <p class="mt-2">Flag Reason: {task.reason.substring(12)}</p>
                <p class="mt-2">{@html task.post.contentHtml}</p>
                
                {#if resolve}
                    <form class="mt-4 space-y-2" method="POST" onsubmit={(e) => onSubmit(e)}>
                        <div>
                            <label class="block mb-1 font-medium" for="decision">Decision</label>
                            <select class="w-full border rounded px-3 py-2" id="decision" name="decision">
                                <option value="APPROVE">Approve</option>
                                <option value="REJECT">Reject</option>
                            </select>
                        </div>
                        <div>
                            <label class="block mb-1 font-medium" for="rationale">Rationale</label>
                            <textarea class="w-full border rounded px-3 py-2" rows="4" placeholder="Provide your rationale..." id="rationale" name="rationale"></textarea>
                        </div>
                        <button type="submit" class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit Decision</button>
                    </form>
                {:else}
                    <button class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onclick={()=> resolve = true}>Resolve Task</button>
                {/if}
                
            </li>
        {/each}
    </ul>
{/if}
</div>

