<script lang="ts">
    import { fly } from "svelte/transition";
    import { chatMessages } from "../../chat";
    import VideoCallMessage from "./VideoCallMessage.svelte";
    import PongMessage from "./PongMessage.svelte";
    import ChatMessage from "./ChatMessage.svelte";
    import Sender from "./Sender.svelte";
</script>

<div class="chat">
    <div class="message-box">
        {#each $chatMessages as chat}
            <div in:fly={{ y: 100, duration: 500 }}>
                {#if chat.type === "chat"}
                    <ChatMessage user={chat.user} message={chat.message} />
                {:else if chat.type === "videoCall"}
                    <VideoCallMessage user={chat.user} />
                {:else}
                    <PongMessage user={chat.user} />
                {/if}
            </div>
        {/each}
    </div>
    <Sender />
</div>

<style>
    .chat {
        margin-left: 150px;
        height: clamp(500px, 90vh, 1000px);
        width: clamp(400px, 60vh, 700px);
    }

    .message-box {
        height: 80%;
        width: 100%;
        border: solid 2px;
        padding: 3%;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
