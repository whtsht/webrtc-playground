<script lang="ts">
    import { userName } from "../../chat";
    import { getMembers } from "../../videoCall";
    import SpeechBubble from "../SpeechBubble.svelte";
    export let user: string;
</script>

<SpeechBubble name={user}>
    <p>Let's start video call!</p>
    {#if user !== $userName}
        <button style="margin-bottom: 20px;" on:click={() => getMembers(user)}
            >Join</button
        >
    {/if}
</SpeechBubble>
