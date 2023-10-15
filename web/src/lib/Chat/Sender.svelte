<script lang="ts">
    import { chatMessages, roomName, sendMessage, userName } from "../../chat";
    import {
        joinVideoCall,
        videoCallMembers,
        display as diplayVideoCall,
    } from "../../videoCall";
    import Send from "svelte-material-icons/Send.svelte";
    import Phone from "svelte-material-icons/Phone.svelte";
    import Controller from "svelte-material-icons/Controller.svelte";
    import { display as displayPong } from "../../pong";

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

<style>
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
