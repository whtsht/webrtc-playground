<script lang="ts">
    import SpeechBubble from "./SpeechBubble.svelte";
    import { fly } from "svelte/transition";
    import Send from "svelte-material-icons/Send.svelte";
    import Phone from "svelte-material-icons/Phone.svelte";
    import Controller from "svelte-material-icons/Controller.svelte";
    import { roomName, chatMessages, userName, sendMessage } from "../chat";
    import {
        display as diplayVideoCall,
        joinVideoCall,
        videoCallMembers,
        getMembers,
    } from "../videoCall";
    import { joinGame, display as displayPong } from "../pong";

    let value = "";

    function startVideoCall() {
        if ($roomName) {
            chatMessages.update((messages) => [
                ...messages,
                { user: $userName, type: "videoCall" },
            ]);
            sendMessage({
                type: "videoCall",
                user: $userName,
            });
            $joinVideoCall = false;
            $diplayVideoCall = true;
            $videoCallMembers = [...$videoCallMembers, $userName];
        }
    }

    function startGame() {
        if ($roomName) {
            chatMessages.update((messages) => [
                ...messages,
                { user: $userName, type: "pong" },
            ]);
            sendMessage({ type: "pong", user: $userName });
            $displayPong = true;
        }
    }

    function sendChatMessage() {
        if (value !== "" && $roomName && $userName) {
            chatMessages.update((messages) => [
                ...messages,
                { user: $userName, type: "chat", message: value },
            ]);
            sendMessage({ type: "chat", message: value, user: $userName });
        }
        value = "";
    }

    function handleKeyboard(event: KeyboardEvent) {
        if (event.shiftKey && event.key === "Enter") {
            event.preventDefault();
            sendChatMessage();
        }
    }
</script>

<div class="chat">
    <div class="message-box">
        {#each $chatMessages as chat}
            {#if chat.type === "chat"}
                <div in:fly={{ y: 100, duration: 500 }}>
                    <SpeechBubble name={chat.user}>
                        <p>{chat.message}</p>
                    </SpeechBubble>
                </div>
            {:else if chat.type === "videoCall"}
                <SpeechBubble name={chat.user}>
                    <p>Let's start video call!</p>
                    {#if chat.user !== $userName}
                        <button
                            style="margin-bottom: 20px;"
                            on:click={() => getMembers(chat.user)}>Join</button
                        >
                    {/if}
                </SpeechBubble>
            {:else}
                <SpeechBubble name={chat.user}>
                    <p>Let's start pong game!</p>
                    {#if chat.user !== $userName}
                        <button
                            style="margin-bottom: 20px;"
                            on:click={() => {
                                joinGame(chat.user);
                            }}>Join</button
                        >
                    {/if}
                </SpeechBubble>
            {/if}
        {/each}
    </div>

    <div class="sender">
        <textarea bind:value on:keydown={handleKeyboard} />
        <button on:click={sendChatMessage}>
            <Send size="24px" viewBox="0 0 24 20" />
        </button>
        <button on:click={startVideoCall}>
            <Phone size="24px" viewBox="0 0 24 20" />
        </button>
        <button on:click={startGame}>
            <Controller size="24px" viewBox="0 0 24 20" />
        </button>
    </div>
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

    .sender {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3%;
        gap: 10px;
        height: 15%;
        width: 100%;
    }

    .sender textarea {
        width: 100%;
        height: 50px;
        resize: none;
    }

    .sender button {
        height: 50px;
        border: solid 2px;
        background-color: #f1f1f1;
    }

    .sender button:hover {
        height: 50px;
        border: solid 2px;
        background-color: #555;
    }
</style>
