<script lang="ts">
    export let display: boolean;
    let modal: HTMLElement | null = null;

    $: display,
        (() => {
            if (modal) {
                modal.style.display = display ? "block" : "none";
            }
        })();
</script>

<div class="modal" bind:this={modal}>
    <div class="modal-content">
        <slot />
    </div>
</div>

<style>
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
        display: inline-block;
        background-color: rgba(0, 0, 0, 0);
        margin: 7vh 0;
        width: auto;
        position: relative;
    }
</style>
