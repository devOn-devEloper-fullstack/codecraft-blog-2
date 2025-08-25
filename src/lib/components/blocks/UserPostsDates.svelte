<script lang="ts">
	let { date }: { date: string } = $props();

	let dateString: string | null | undefined = $state();

	if (date === null) {
		dateString = undefined;
	} else {
		dateString = new Date(date).toLocaleDateString('en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}
</script>

<p>{dateString}</p>
