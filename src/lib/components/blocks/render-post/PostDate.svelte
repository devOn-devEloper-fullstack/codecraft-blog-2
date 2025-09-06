<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { date }: { date: Date } = $props();

	let relativeTime = $state('');
	let interval: NodeJS.Timeout;

	function getRelativeTime(d) {
		const now = new Date();
		const target = new Date(d);
		const diff = Math.floor((now.getTime() - target.getTime()) / 1000); // seconds

		if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`;
		if (diff < 3600) {
			const mins = Math.floor(diff / 60);
			return `${mins} min${mins !== 1 ? 's' : ''} ago`;
		}
		if (diff < 86400) {
			const hours = Math.floor(diff / 3600);
			return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
		}
		if (diff < 2592000) {
			const days = Math.floor(diff / 86400);
			return `${days} day${days !== 1 ? 's' : ''} ago`;
		}
		if (diff < 31536000) {
			const months = Math.floor(diff / 2592000);
			return `${months} month${months !== 1 ? 's' : ''} ago`;
		}
		const years = Math.floor(diff / 31536000);
		return `${years} year${years !== 1 ? 's' : ''} ago`;
	}

	function updateTime() {
		relativeTime = getRelativeTime(date);
	}

	onMount(() => {
		updateTime();
		// update every 30s for freshness
		interval = setInterval(() => updateTime, 30 * 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<span class="text-md font-semibold text-gray-400 uppercase">{relativeTime}</span>
