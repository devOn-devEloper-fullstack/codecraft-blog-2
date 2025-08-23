<script lang="ts">
	import '../../app.css';
	import {
		House,
		SquarePen,
		Newspaper,
		Settings,
		MessageCircle,
		CircleUserRound,
		ChevronDown,
		Search,
		Bell,
		Moon,
		Sun
	} from 'lucide-svelte';
	import type { LayoutProps } from './$types';
	import { Avatar, button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let { children, data }: LayoutProps = $props();
	let { session } = data;

	let { user } = session || {};

	function getUserInitials(name: string): string {
		const names = name.split(' ');
		if (names.length === 1) return names[0].charAt(0).toUpperCase();
		return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
	}

	let theme = 'light';
	let isDarkMode = $state(false);

	onMount(() => {
		const saved = localStorage.getItem('theme');

		isDarkMode = saved === 'dark' ? true : false;

		if (saved) {
			theme = saved;
			applyTheme();
		}
	});

	function applyTheme() {
		document.body.classList.toggle('dark', theme === 'dark');
	}

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		applyTheme();

		isDarkMode = theme === 'dark' ? true : false;
	}
</script>

<svelte:head>
	<script>
		if (!localStorage.getItem('theme')) {
			const userPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
			localStorage.setItem('theme', userPreference);
		}
	</script>
</svelte:head>

<main
	class="grid h-[100vh] w-[100vw] grid-cols-[40px_calc(100vw-40px)] grid-rows-[60px_calc(100vh-60px)] overflow-auto"
>
	<aside class="fixed z-35 h-[100vh] w-[40px] bg-blue-800">
		<nav class="flex h-full flex-col items-center justify-center">
			<ul class="flex h-full flex-col items-center justify-center gap-3 space-y-2">
				<li>
					<a href="/" class="rounded-md text-white hover:bg-gray-200"><House class="w-[20px]" /></a>
				</li>
				<li>
					<a href="/" class="rounded-md text-white hover:bg-gray-200"
						><SquarePen class="w-[20px]" /></a
					>
				</li>
				<li>
					<a href="/" class="rounded-md text-white hover:bg-gray-200"
						><Newspaper class="w-[20px]" /></a
					>
				</li>
				<li>
					<a href="/" class="rounded-md text-white hover:bg-gray-200"
						><MessageCircle class="w-[20px]" /></a
					>
				</li>
				<li>
					<a href="/" class="rounded-md text-white hover:bg-gray-200"
						><CircleUserRound class="w-[20px]" /></a
					>
				</li>
				<li>
					<a href="/" class="rounded-md text-white hover:bg-gray-200"
						><Settings class="w-[20px]" /></a
					>
				</li>
			</ul>
		</nav>
	</aside>
	<nav
		class="fixed z-30 flex h-[60px] w-[calc(100vw-40px)] translate-x-[40px] items-center justify-between border-b border-gray-300 bg-gray-100 px-4"
	>
		<div class="flex w-full items-center justify-between space-x-4">
			<h1 class="text-xl font-bold">CodeCraft Blog</h1>
			<div class="flex flex-row items-center space-x-2">
				<span class="text-xl font-semibold">{user.name}</span>
				<div class="rounded-full border border-gray-500 px-0.5 hover:bg-gray-200">
					<ChevronDown class="w-[15px]" />
				</div>
			</div>

			<div class="flex items-center space-x-2">
				<Search class="text-black" />
				<Bell />

				{#if isDarkMode}
					<button type="button" onclick={toggleTheme}><Sun /></button>
				{:else}
					<button type="button" onclick={toggleTheme}><Moon /></button>
				{/if}
				<Avatar class="rounded-full border border-gray-500 px-2 py-2 ring-gray-500"
					>{getUserInitials(user.name)}</Avatar
				>
				<button
					class="rounded bg-[var(--color-primary)] px-4 py-2 text-white hover:bg-[var(--primary-300)]"
					>Logout</button
				>
			</div>
		</div>
	</nav>

	<section class="mr-10 ml-10 h-[100vh] w-fit translate-y-[60px]">
		{@render children?.()}
	</section>
</main>
