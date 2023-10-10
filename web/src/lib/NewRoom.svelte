<script lang="ts">
    import Modal from "./Modal.svelte";
    import { createOrJoinRoom, roomName } from "../chat";
    let validationError: HTMLElement | null = null;

    let displayNewRoom = false;

    let name = "";

    export function open() {
        displayNewRoom = true;
    }

    function close() {
        displayNewRoom = false;
    }

    function validation(): null | string {
        if (name == "") return "Please specify the room name";

        $roomName = name;
        return null;
    }

    function joinRoom() {
        const error = validation();
        if (error !== null) {
            validationError!.innerText = error;
        } else {
            createOrJoinRoom(name)
                .then((msg) => {
                    displayNewRoom = false;
                    console.log(msg);
                })
                .catch((error) => {
                    $roomName = null;
                    validationError!.innerText = error;
                });
        }
    }

    $: if (validationError && !displayNewRoom) {
        validationError.innerText = "";
        name = "";
    }
</script>

<Modal bind:display={displayNewRoom}>
    <div class="pannel">
        <form>
            <label for="room-name" id="room-name-label" class="elem"
                >Room Name</label
            >
            <input id="room-name" class="elem" type="text" bind:value={name} />
            <p bind:this={validationError} />
            <div class="elem">
                <button type="button" on:click={close}>Cancel</button>
                <button type="button" on:click={joinRoom}>Join</button>
            </div>
        </form>
    </div>
</Modal>

<style>
    .pannel {
        padding: 20px;
        background-color: #fff;
    }

    .elem {
        padding: 10px;
        margin: 10px;
    }

    .elem button {
        margin: 0 20px;
        width: 120px;
    }

    p {
        color: red;
    }
</style>
