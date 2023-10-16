<script lang="ts">
    import { chatMembers, chatMessages, roomName } from "../chat";
    import { connects } from "../webrtc";
    import Modal from "./Modal.svelte";

    let display = false;

    export function open() {
        display = true;
    }

    function close() {
        display = false;
    }

    function leaveRoom() {
        $roomName = null;
        $chatMembers = [];
        $chatMessages = [];
        connects.forEach((connect) => {
            connect.chatConnection.close();
        });
        close();
    }
</script>

<Modal {display}>
    <div class="pannel">
        <p>Do you want to leave the room?</p>
        <div class="elem">
            <button type="button" on:click={close}>No</button>
            <button type="button" on:click={leaveRoom}>Yes</button>
        </div>
    </div>
</Modal>

<style>
    .pannel {
        padding: 20px;
        background-color: #fff;
    }

    .elem {
        margin: 10px;
        margin: 10px;
    }

    .elem button {
        margin: 0 20px;
        width: 120px;
    }
</style>
