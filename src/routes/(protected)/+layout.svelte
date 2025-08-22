<script lang="ts">
	import '../../app.css';
	import { House, SquarePen, Newspaper, Settings, MessageCircle, CircleUserRound, ChevronDown } from 'lucide-svelte';
	import type { LayoutProps } from './$types';
	import { Avatar } from 'flowbite-svelte';

	let { children, data }: LayoutProps = $props();
	let { session } = data;

	let { user } = session || {};

	function getUserInitials(name: string): string {
		const names = name.split(' ');
		if (names.length === 1) return names[0].charAt(0).toUpperCase();
		return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
	}
</script>


<main class="w-[100vw] h-[100vh] grid grid-cols-[40px_calc(100vw-40px)] grid-rows-[60px_calc(100vh-60px)] overflow-auto">
	<aside class="h-[100vh] w-[40px] bg-blue-800 overflow-y-scroll fixed">
  <nav class="flex flex-col items-center justify-center h-full">
	<ul class="flex flex-col space-y-2 items-center justify-center h-full gap-3">
	  <li><a href="/" class="text-white hover:bg-gray-200 rounded-md"><House class="w-[20px]"/></a></li>
	  <li><a href="/" class="text-white hover:bg-gray-200 rounded-md"><SquarePen class="w-[20px]"/></a></li>
	  <li><a href="/" class="text-white hover:bg-gray-200 rounded-md"><Newspaper class="w-[20px]"/></a></li>
	  <li><a href="/" class="text-white hover:bg-gray-200 rounded-md"><MessageCircle class="w-[20px]"/></a></li>
	  <li><a href="/" class="text-white hover:bg-gray-200 rounded-md"><CircleUserRound class="w-[20px]"/></a></li>
	  <li><a href="/" class="text-white hover:bg-gray-200 rounded-md"><Settings class="w-[20px]"/></a></li>
	</ul>
  </nav>
</aside>
<nav class="flex h-[60px] w-[calc(100vw-40px)] border-b border-gray-300 bg-gray-100 px-4 justify-between items-center translate-x-[40px] fixed z-30">
  <div class="flex items-center space-x-4 justify-between w-full">
	<h1 class="text-xl font-bold">CodeCraft Blog</h1>
	<div class="flex flex-row items-center space-x-2">
		<span class="text-xl font-semibold">{user.name}</span>
		<div class="rounded-full px-0.5 border border-gray-500 hover:bg-gray-200">
			<ChevronDown class="w-[15px]"/>
		</div>
		
	</div>
	

	<div class="flex items-center space-x-2">
	<!-- Add user profile or logout button here if needed -->
			<button class="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-600">Logout</button>
			<Avatar class="border border-gray-500 ring-gray-500 rounded-full px-2 py-2">{getUserInitials(user.name)}</Avatar>
  </div>
  </div>
</nav>

<section class="overflow-y-auto p-4 h-[100vh] w-[100vw] ml-10 translate-y-[60px]">
	{@render children?.()}
</section>

</main>


