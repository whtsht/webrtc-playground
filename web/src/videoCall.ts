import { get, writable, type Writable } from "svelte/store";
import { userName } from "./chat";
import { open } from "./lib/Snackbar.svelte";
import { connects, sendAnswer, sendOffer, setAnswer, setOffer } from "./webrtc";

export const videoCallMembers: Writable<string[]> = writable([]);

export const joinVideoCall = writable(false);

export const localStream: Writable<null | MediaStream> = writable(null);

export const remoteStreams: Writable<Map<string, MediaStream>> = writable(
    new Map()
);
export const display = writable(false);

type Negotiate =
    | { type: "startNegotiate"; from: string }
    | { type: "offer"; from: string; sdp: string }
    | { type: "answer"; from: string; sdp: string }
    | { type: "candidate"; from: string; candidate: string }
    | { type: "getMembers"; from: string }
    | { type: "members"; from: string; members: string[] };

export function createNegotiationChannel(peer: RTCPeerConnection) {
    const negotiateChannel = peer.createDataChannel("negotiate");
    negotiateChannel.onmessage = async (ev) => {
        const negotiate: Negotiate = JSON.parse(ev.data);
        if (negotiate.type === "startNegotiate") {
            console.log(`[video startNegotiate] from: ${negotiate.from}`);
            const connect = connects.get(negotiate.from)!;
            const peer = newPeerConnection(negotiate.from);
            connect.videoCallConnection = peer;
            return;
        }
        if (negotiate.type === "getMembers") {
            console.log(`[video getMembers] from: ${negotiate.from}`);
            sendNegotiate(negotiate.from, {
                type: "members",
                from: get(userName),
                members: get(videoCallMembers),
            });
            return;
        }
        if (negotiate.type === "members") {
            console.log(
                `[video members] from: ${negotiate.from}, members: ${negotiate.members}`
            );
            if (negotiate.members.length === 0) {
                open("video call is finished");
                return;
            }
            videoCallMembers.set(negotiate.members);
            joinVideoCall.set(true);
            display.set(true);
            return;
        }
        if (negotiate.type === "offer") {
            console.log(
                `[video offser] from: ${negotiate.from}, sdp: ${negotiate.sdp}`
            );
            const peer = getPeer(negotiate.from);
            await setOffer(peer, JSON.parse(negotiate.sdp));
            await sendAnswer(peer, negotiate.from, sendSdp);
            return;
        }
        if (negotiate.type === "answer") {
            console.log(
                `[video answer] from: ${negotiate.from}, sdp: ${negotiate.sdp}`
            );

            const peer = getPeer(negotiate.from);
            await setAnswer(peer, JSON.parse(negotiate.sdp));
            return;
        }
        if (negotiate.type === "candidate") {
            console.log(
                `[video candidate] from: ${negotiate.from}, sdp: ${negotiate.candidate}`
            );

            getPeer(negotiate.from).addIceCandidate(
                JSON.parse(negotiate.candidate)
            );
        }
    };

    return negotiateChannel;
}

export function getMembers(to: string) {
    sendNegotiate(to, { type: "getMembers", from: get(userName) });
}

export async function startNegotiate(to: string, from: string) {
    sendNegotiate(to, {
        type: "startNegotiate",
        from,
    });
    await sendOffer(newPeerConnection, to, sendSdp);
}

function getPeer(to: string) {
    return connects.get(to)!.videoCallConnection!;
}

function newPeerConnection(to: string): RTCPeerConnection {
    const peer = new RTCPeerConnection();
    peer.onconnectionstatechange = (_) => {
        console.log(`connection state: ${peer.connectionState}`);
        if (peer.connectionState === "connected") {
            videoCallMembers.update((members) => [...members, to]);
        } else if (
            peer.connectionState === "disconnected" ||
            peer.connectionState === "failed" ||
            peer.connectionState === "closed"
        ) {
            videoCallMembers.update((members) =>
                members.filter((member) => member !== to)
            );
            remoteStreams.update((streams) => {
                streams.delete(to);
                return streams;
            });
        }
    };

    peer.onicecandidate = (ev) => {
        if (ev.candidate) {
            sendNegotiate(to, {
                type: "candidate",
                from: get(userName),
                candidate: JSON.stringify(ev.candidate),
            });
        }
    };

    const stream = get(localStream)!;
    stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
    });

    peer.ontrack = (ev) => {
        console.log(peer.connectionState);
        remoteStreams.update((streams) => streams.set(to, ev.streams[0]));
    };

    connects.get(to)!.videoCallConnection = peer;
    return peer;
}

function sendNegotiate(to: string, value: Negotiate) {
    const connect = connects.get(to)!;
    connect.negotiateChannel.send(JSON.stringify(value));
}

function sendSdp(
    type: "offer" | "answer",
    sdp: RTCSessionDescription,
    to: string,
    from: string
) {
    sendNegotiate(to, { type, from, sdp: JSON.stringify(sdp) });
}
