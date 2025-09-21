<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
</script>

<article
	class="items-top flex w-full flex-row gap-4 border-b border-gray-200 p-4 dark:border-gray-700"
>
	<Avatar src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" />
	<div class="flex flex-col gap-2">
		<div class="flex flex-col">
			<p class="text-sm font-semibold text-gray-900">Bonnie Green</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">Joined in August 2021</p>
		</div>
		<p class="text-gray-500 dark:text-gray-400">
			Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
			instruments for the UX designers. The key to a great UX design is to
			<a href="#" class="text-blue-600 hover:underline dark:text-blue-500">see this</a>.
		</p>
		<div class="text-sm text-gray-400">2 days ago</div>
	</div>
</article>
