<script lang="ts">
	import type { LayoutProps } from "../$types";

    let { data }: LayoutProps = $props();
    let { session } = data;

	let { user } = session || {};
</script>

<div class="grid grid-cols-[1.5fr_3fr_1.5fr] items-center h-[100vh] w-[calc(100vw-40px)] overflow-y-auto gap-4">
    <div class="border border-black w-[100%] h-[100%] flex flex-col gap-4">
        <div class="w-full h-[40%] border border-black flex flex-col justify-items-start items-center">
            <div class="w-[120px] h-[120px] rounded-xl border border-black mt-5">
            </div>
            <span class="mt-2">{user.name}</span>
            <div class="w-[90%] border border-black h-[35px] mt-6 rounded-full"></div>
            <div class="w-[90%] border border-black h-[35px] mt-2 rounded-full"></div>
            <div class="w-[90%] border border-black h-[35px] mt-2 rounded-full"></div>

        </div>
        <div class="w-full border border-black"></div>
    </div>
        
    <div class="border border-black w-[100%] h-[100%]"></div>
    <div class="border border-black w-[100%] h-[100%]"></div>
</div>