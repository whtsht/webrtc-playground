<script lang="ts" context="module">
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
    const visible = writable(false);

    let message = "";

    export function open(msg: string) {
        visible.set(true);
        message = msg;
        setTimeout(() => {
            visible.set(false);
        }, 2000);
    }
</script>

{#if $visible}
    <div id="snackbar" transition:fly={{ y: 100, duration: 500 }}>
        <p>{message}</p>
    </div>
{/if}

<style>
    #snackbar {
        min-width: 200px;
        width: auto;
        padding: 0 20px;
        background-color: #333;
        color: #fff;
        position: fixed;
        z-index: 1;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
