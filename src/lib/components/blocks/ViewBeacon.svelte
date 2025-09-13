<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { endpoint }: { endpoint: string } = $props();

	const VISIBILITY_MS_THRESHOLD = 5000; // 5 seconds
	const SCROLL_PERCENT_THRESHOLD = 33; // 33%
	const DEBOUNCE_MS = 30000; // 30 seconds

	let lastSent = $state(0);
	let visibleSince: number | null = $state(null);
	let maxScrollPercent = $state(0);

	function ensureAnonId() {
		const key = 'cc.anonId';
		let anonId = localStorage.getItem(key);
		if (!anonId) {
			anonId = crypto.randomUUID();
			localStorage.setItem(key, anonId);
		}
		return anonId;
	}

	function onVisibilityChange() {
		if (document.visibilityState === 'visible') {
			visibleSince = performance.now();
		} else if (visibleSince !== null) {
			const delta = performance.now() - visibleSince;
			maybeSend(delta);
			visibleSince = null;
		}
	}

	function onScroll() {
		const scrolled = window.scrollY + window.innerHeight;
		const percent = Math.min(100, (scrolled / document.body.scrollHeight) * 100);

		if (percent > maxScrollPercent) {
			maxScrollPercent = percent;
		}

		if (percent >= SCROLL_PERCENT_THRESHOLD) {
			maybeSend();
		}
	}

	async function maybeSend(extraVisibleMs = 0) {
		const now = Date.now();
		if (now - lastSent < DEBOUNCE_MS) {
			return;
		}
		const tVisibleMs = (visibleSince ? performance.now() - visibleSince : 0) + extraVisibleMs;
		if (tVisibleMs < VISIBILITY_MS_THRESHOLD && maxScrollPercent < SCROLL_PERCENT_THRESHOLD) {
			return;
		}

		lastSent = now;

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					context: {
						tVisibleMs: Math.round(tVisibleMs),
						scrollPercent: Math.round(maxScrollPercent),
						anonId: ensureAnonId()
					}
				})
			});

			if (!response.ok) {
				console.debug('Failed to send view beacon', await response.text());
			}
		} catch (e) {
			console.error('Failed to send view beacon', e);
		}
	}

	onMount(() => {
		visibleSince = performance.now();
		document.addEventListener('visibilitychange', onVisibilityChange);
		window.addEventListener('scroll', onScroll, { passive: true });
	});

	onDestroy(() => {
		document.removeEventListener('visibilitychange', onVisibilityChange);
		window.removeEventListener('scroll', onScroll);
		if (visibleSince !== null) {
			const delta = performance.now() - visibleSince;
			maybeSend(delta);
		}
	});
</script>
