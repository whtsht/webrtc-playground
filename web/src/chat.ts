import { connect } from "socket.io-client";
import { get, writable, type Writable } from "svelte/store";
import { createNegotiationChannel } from "./videoCall";
import { createPongChannel } from "./pong";
import { connects, sendAnswer, sendOffer, setAnswer, setOffer } from "./webrtc";

export const roomName: Writable<null | string> = writable(null);

export const userName = writable("");

export const chatMembers: Writable<string[]> = writable([]);

export type ChatMessage =
    | { user: string; type: "chat"; message: string }
    | { user: string; type: "videoCall" }
    | { user: string; type: "pong" };

export const chatMessages: Writable<ChatMessage[]> = writable([]);

const socket = connect("http://localhost:8080");

let connected = false;

const timeout = 3000;

export function createOrJoinRoom(name: string) {
    return new Promise((resolve, reject) => {
        let timer: null | NodeJS.Timeout = null;
        if (!connected) {
            reject("not connected");
        }

        socket.emit("create or join", name);

        socket.once("full", (room: string) => {
            if (timer) clearTimeout(timer);
            reject(`room ${room} is full`);
        });

        socket.once("created", () => {
            if (timer) clearTimeout(timer);
            roomName.set(name);
            resolve("created");
        });

        socket.once("joined", async (members: string[]) => {
            if (timer) clearTimeout(timer);
            for (const member of members) {
                await sendOffer(newPeerConnection, member, sendSdp);
            }

            resolve("joined");
        });

        timer = setTimeout(() => {
            reject("timeout waiting for message");
        }, timeout);
    });
}

export function sendMessage(message: ChatMessage) {
    connects.forEach(({ chatConnection: _, chatChannel }) => {
        try {
            chatChannel.send(JSON.stringify(message));
        } catch (_) {}
    });
}

function getPeer(to: string) {
    return connects.get(to)!.chatConnection!;
}

function newPeerConnection(to: string) {
    const peer = new RTCPeerConnection();
    peer.onconnectionstatechange = (_) => {
        console.log(`connection state: ${peer.connectionState}`);
        if (peer.connectionState === "connected") {
            chatMembers.update((members) => [...members, to]);
        } else if (
            peer.connectionState === "disconnected" ||
            peer.connectionState === "failed" ||
            peer.connectionState === "closed"
        ) {
            chatMembers.update((members) =>
                members.filter((member) => member !== to)
            );
        }
    };

    peer.ondatachannel = (ev) => {
        const {
            chatConnection,
            videoCallConnection,
            chatChannel,
            negotiateChannel,
            pongChannel,
        } = connects.get(to)!;
        if (ev.channel.label == "chat") {
            connects.set(to, {
                chatConnection,
                videoCallConnection,
                chatChannel: ev.channel,
                negotiateChannel,
                pongChannel,
            });
        } else if (ev.channel.label == "negotiate") {
            connects.set(to, {
                chatConnection,
                videoCallConnection,
                chatChannel,
                negotiateChannel: ev.channel,
                pongChannel,
            });
        } else {
            connects.set(to, {
                chatConnection,
                videoCallConnection,
                chatChannel,
                negotiateChannel,
                pongChannel: ev.channel,
            });
        }
    };

    const chatChannel = peer.createDataChannel("chat");
    chatChannel.onmessage = (ev) => {
        const message: ChatMessage = JSON.parse(ev.data);
        console.log(message);
        chatMessages.update((messages) => {
            return [...messages, message];
        });
    };

    const negotiateChannel = createNegotiationChannel(peer);

    const pongChannel = createPongChannel(peer);

    peer.onicecandidate = (ev) => {
        if (ev.candidate) {
            console.log(ev.candidate);
            sendCandidate(ev.candidate, to, socket.id);
        }
    };

    connects.set(to, {
        chatConnection: peer,
        videoCallConnection: null,
        chatChannel,
        negotiateChannel,
        pongChannel,
    });

    return peer;
}

function sendSdp(
    type: "offer" | "answer",
    sdp: RTCSessionDescription,
    to: string,
    from: string
) {
    socket.emit(type, get(roomName), to, from, JSON.stringify(sdp));
}

function sendCandidate(candidate: RTCIceCandidate, to: string, from: string) {
    socket.emit(
        "candidate",
        get(roomName),
        to,
        from,
        JSON.stringify(candidate)
    );
}

socket.on("connect", () => {
    connected = true;
    userName.set(socket.id);

    socket.on("join", async (from: string) => {
        newPeerConnection(from);
    });

    socket.on("offer", async (to: string, from: string, sdp: string) => {
        if (to !== socket.id) return;
        console.log(`[offer] to: ${to}, from: ${from}, sdp: ${sdp}`);
        const peer = getPeer(from);

        await setOffer(peer, JSON.parse(sdp));
        await sendAnswer(peer, from, sendSdp);
    });

    socket.on("answer", async (to: string, from: string, sdp: string) => {
        if (to !== socket.id) return;
        console.log(`[answer] to: ${to}, from: ${from}, sdp: ${sdp}`);
        const peer = getPeer(from);
        await setAnswer(peer, JSON.parse(sdp));
    });

    socket.on("candidate", (to: string, from: string, candidate: string) => {
        if (to !== socket.id) return;
        getPeer(from).addIceCandidate(JSON.parse(candidate));
    });
});
