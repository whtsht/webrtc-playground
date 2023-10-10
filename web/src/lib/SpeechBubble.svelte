<script lang="ts">
    import { userName } from "../chat";
    export let name: string;
</script>

<div class="outer">
    {#if name == $userName}
        <div class="message left-message">
            <slot />
            <div class="point left-point" />
        </div>
    {:else}
        <div class="message right-message">
            <p class="user-name">{name}</p>
            <slot />
            <div class="point right-point" />
        </div>
    {/if}
</div>

<style>
    p {
        color: #fff;
        word-wrap: break-word;
        max-width: 200px;
        text-align: start;
        white-space: pre;
    }

    p.user-name {
        font-size: 13px;
    }

    .outer {
        padding: 2% 0;
    }

    .message {
        z-index: 1;
        display: inline-block;
        width: auto;
        height: auto;
        min-width: 60px;
        min-height: 60px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #000;
        border-radius: 10px;
        position: relative;
        color: #fff;
    }

    .point {
        z-index: -1;
        width: 0;
        height: 0;
        position: absolute;
        bottom: -20px;
        border-top: 70px solid #000;
    }

    .left-message {
        left: -20%;
    }

    .left-point {
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: -10px;
        transform: rotate(70deg);
    }

    .right-message {
        right: -20%;
    }

    .right-point {
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        right: -10px;
        transform: rotate(-70deg);
    }
</style>
