<script lang="ts">
    import * as d3 from 'd3';
    import type { TotalPostLikesByDate } from '$lib/server/analytics';

    let { data }: { data: TotalPostLikesByDate } = $props();

    // Dimensions
    const width = 600
    const height = 600
    const margins = { top: 20, right: 20, bottom: 20, left: 20 };

    // Scales
    let x = $derived.by(() => {
        return d3.scaleUtc()
            .domain(d3.extent(data, (d) => d.createdAt))
            .range([margins.left, width - margins.right]);
    })

    let y = $derived.by(() => {
        return d3.scaleLinear()
            .domain([0, d3.max(data, d => d._count.id) || 0])
            .range([height - margins.bottom, margins.top]);
    })

    let line = $derived.by(() => {
        return d3.line((d, i) => x(i), y)
    })

</script>
<svg width={width} height={height}>
    <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
    <g fill="white" stroke="currentColor" stroke-width="1.5">
        {#each data as d, i}
            <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        {/each}
    </g>
</svg>