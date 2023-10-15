<script lang="ts">
    import SpeechBubble from "../SpeechBubble.svelte";
    export let user: string;
    export let message: string;
</script>

<SpeechBubble name={user}>
    <p>{message}</p>
</SpeechBubble>
