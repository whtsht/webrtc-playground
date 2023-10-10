<script lang="ts">
    import { chatMembers, roomName, userName } from "../chat";
    import NewRoom from "./NewRoom.svelte";
    import LeaveRoom from "./LeaveRoom.svelte";

    export let newRoom: NewRoom;
    export let leaveRoom: LeaveRoom;
</script>

<div class="sidebar">
    <p style="color: #04aa6d">Room</p>
    {#if $roomName !== null}
        <button class="active" on:click={leaveRoom.open}>
            {$roomName}
        </button>
    {:else}
        <button on:click={newRoom.open}>New Room</button>
    {/if}

    <div style="height: 10%;" />

    <p style="color: #04aa6d">Member</p>
    {#each $chatMembers as member}
        <p>{member}</p>
    {/each}

    <div style="height: 40%;" />

    <p style="color: #04aa6d">User Name</p>
    <input type="text" bind:value={$userName} disabled />
</div>

<style>
    .sidebar {
        margin: 0;
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
        width: 200px;
        background-color: #f1f1f1;
        height: 100vh;
        overflow: auto;
    }

    .sidebar button {
        padding: 20px;
        width: 100%;
        border-radius: 0;
        border: none;
        margin: 0;
        text-decoration: none;
        outline: none;
    }

    .sidebar button.active {
        background-color: #04aa6d;
        color: white;
    }

    .sidebar button:hover:not(.active) {
        background-color: #555;
        color: white;
    }
</style>
