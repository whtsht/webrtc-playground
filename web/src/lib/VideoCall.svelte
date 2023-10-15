<script lang="ts">
    import Modal from "./Modal.svelte";
    import { userName } from "../chat";
    import {
        display,
        localStream,
        joinVideoCall,
        videoCallMembers,
        remoteStreams,
        startNegotiate,
    } from "../videoCall";
    import { connects } from "../webrtc";

    let video: HTMLVideoElement | null = null;

    function closeCall() {
        $videoCallMembers.forEach((user) => {
            if (user === $userName) return;
            const peer = connects.get(user)!;
            if (peer.videoCallConnection) {
                peer.videoCallConnection!.close();
                peer.videoCallConnection = null;
            }
        });
        video!.srcObject = null;
        $videoCallMembers = [];
        $display = false;
    }

    $: $display, onSwitch();
    async function onSwitch() {
        if ($display) {
            $localStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true,
            });
            if (video) {
                video.srcObject = $localStream;
            }
            if ($joinVideoCall) {
                for (let i = 0; i < $videoCallMembers.length; i++) {
                    if ($videoCallMembers[i] === $userName) continue;
                    await startNegotiate($videoCallMembers[i], $userName);
                }
            }
        } else {
            if (video) {
                video.pause();
                video.srcObject = null;
            }
            if ($localStream) {
                $localStream.getTracks().forEach((track) => track.stop());
            }
            $localStream = null;
        }
    }

    function srcObject(node: HTMLVideoElement, stream: MediaStream) {
        node.srcObject = stream;
        return {
            update() {
                node.srcObject = stream;
            },
            destroy() {
                node.srcObject = null;
            },
        };
    }
</script>

<Modal display={$display}>
    <div class="pannel">
        <div>
            <video
                width="400px"
                height="300px"
                muted
                autoplay
                bind:this={video}
            />
            {#each $remoteStreams as [_, stream]}
                <video
                    width="400px"
                    height="300px"
                    muted
                    autoplay
                    use:srcObject={stream}
                />
            {/each}
        </div>

        <button on:click={closeCall}>Close</button>
    </div>
</Modal>

<style>
    .pannel {
        background-color: #fff;
        padding: 20px;
    }

    video {
        margin: 10px;
        border: solid;
    }
</style>
