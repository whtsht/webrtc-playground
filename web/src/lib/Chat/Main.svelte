<script lang="ts">
    import Sender from "./Sender.svelte";
</script>

<div class="chat">
    <div class="message-box" />
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
