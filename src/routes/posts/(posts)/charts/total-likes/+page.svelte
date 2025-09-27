<script lang="ts">
    import PostLikesChart from '$lib/components/blocks/dashboard-charts/PostLikesChart.svelte';
    import type PageProps from './$types';

    let { data }: PageProps = $props();
</script>

<PostLikesChart data={data} />