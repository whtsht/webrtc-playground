import { get } from "svelte/store";
import { userName } from "./chat";

interface PeerConnection {
    chatConnection: RTCPeerConnection;
    videoCallConnection: RTCPeerConnection | null;
    chatChannel: RTCDataChannel;
    negotiateChannel: RTCDataChannel;
}

type SendSdp = (
    type: "offer" | "answer",
    sdp: RTCSessionDescription,
    to: string,
    from: string
) => void;

export const connects: Map<string, PeerConnection> = new Map();

export async function sendOffer(
    newPeerConnection: (to: string) => RTCPeerConnection,
    to: string,
    sendSdp: SendSdp
) {
    const peer = newPeerConnection(to);

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    if (peer.localDescription) {
        sendSdp("offer", peer.localDescription, to, get(userName));
    }
}

export async function setOffer(
    peer: RTCPeerConnection,
    sdp: RTCSessionDescription
) {
    await peer.setRemoteDescription(sdp);
}

export async function sendAnswer(
    peer: RTCPeerConnection,
    to: string,
    sendSdp: SendSdp
) {
    const answer = await peer.createAnswer();

    await peer.setLocalDescription(answer);

    if (peer.localDescription) {
        sendSdp("answer", peer.localDescription, to, get(userName));
    }
}

export async function setAnswer(
    peer: RTCPeerConnection,
    sdp: RTCSessionDescription
) {
    await peer.setRemoteDescription(sdp);
}
