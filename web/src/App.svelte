<script lang="ts">
    import Chat from "./lib/Chat/Main.svelte";
    import SideBar from "./lib/SideBar.svelte";
    import Snackbar from "./lib/Snackbar.svelte";
    import LeaveRoom from "./lib/LeaveRoom.svelte";
    import NewRoom from "./lib/NewRoom.svelte";

    let leaveRoom: LeaveRoom;
    let newRoom: NewRoom;
</script>

<main>
    <SideBar bind:leaveRoom bind:newRoom />
    <Chat />
    <Snackbar />

    <LeaveRoom bind:this={leaveRoom} />
    <NewRoom bind:this={newRoom} />
</main>
