import { connect } from "socket.io-client";
import { get, writable, type Writable } from "svelte/store";
import { connects, sendOffer, sendAnswer, setAnswer, setOffer } from "./webrtc";

export const roomName: Writable<null | string> = writable(null);

export const userName = writable("");

export const chatMembers: Writable<string[]> = writable([]);

export type ChatMessage = { user: string; type: "chat"; message: string };

export const chatMessages: Writable<ChatMessage[]> = writable([]);

const socket = connect("http://localhost:8080");

let connected = false;

const timeout = 3000;

export function createOrJoinRoom(name: string) {
    throw new Error("Not implemented");
}

export function sendMessage(message: ChatMessage) {
    throw new Error("Not implemented");
}

function getPeer(to: string): RTCPeerConnection {
    throw new Error("Not implemented");
}

function newPeerConnection(to: string): RTCPeerConnection {
    throw new Error("Not implemented");
}

function sendSdp(
    type: "offer" | "answer",
    sdp: RTCSessionDescription,
    to: string,
    from: string
) {
    throw new Error("Not implemented");
}

function sendCandidate(candidate: RTCIceCandidate, to: string, from: string) {
    throw new Error("Not implemented");
}

socket.on("connect", () => {});
