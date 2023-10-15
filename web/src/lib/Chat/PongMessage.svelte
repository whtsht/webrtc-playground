<script lang="ts">
    import { userName } from "../../chat";
    import { joinGame } from "../../pong";
    import SpeechBubble from "../SpeechBubble.svelte";
    export let user: string;
</script>

<SpeechBubble name={user}>
    <p>Let's start pong game!</p>
    {#if user !== $userName}
        <button
            style="margin-bottom: 20px;"
            on:click={() => {
                joinGame(user);
            }}>Join</button
        >
    {/if}
</SpeechBubble>
