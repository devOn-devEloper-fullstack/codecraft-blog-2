<script lang="ts">
	import CommentAdd from '$lib/components/blocks/render-post/CommentAdd.svelte';
	import CommentCard from '$lib/components/blocks/render-post/CommentCard.svelte';
	import type { SuperValidated } from 'sveltekit-superforms/client';
	import type { User } from '@prisma/client';
	import type { CommentFormData } from '$lib/types';

	let { formLoadData, userData }: { formLoadData: SuperValidated<CommentFormData>; userData: Partial<User> | null } = $props();
</script>

<section class="mx-auto my-10 w-[1000px]">
	<h2 class="mb-4 text-3xl font-bold">Comments (123)</h2>
	<CommentAdd {formLoadData} {userData} />
	<CommentCard />
</section>
