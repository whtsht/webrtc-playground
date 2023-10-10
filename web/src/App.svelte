<script lang="ts">
    import Chat from "./lib/Chat.svelte";
    import Pong from "./lib/Pong.svelte";
    import SideBar from "./lib/SideBar.svelte";
    import Snackbar from "./lib/Snackbar.svelte";
    import VideoCall from "./lib/VideoCall.svelte";
    import LeaveRoom from "./lib/LeaveRoom.svelte";
    import NewRoom from "./lib/NewRoom.svelte";

    let leaveRoom: LeaveRoom;
    let newRoom: NewRoom;
</script>

<main>
    <SideBar bind:leaveRoom bind:newRoom />
    <Chat />
    <VideoCall />
    <Snackbar />
    <Pong />

    <LeaveRoom bind:this={leaveRoom} />
    <NewRoom bind:this={newRoom} />
</main>
