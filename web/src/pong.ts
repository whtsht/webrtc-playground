import { get, writable, type Writable } from "svelte/store";
import { connects } from "./webrtc";
import { userName } from "./chat";
import { open } from "./lib/Snackbar.svelte";

export const display = writable(true);

export const opponent: Writable<null | string> = writable(null);

export const opponentReady: Writable<boolean> = writable(false);

export const opponentPosition = writable(0);

export const ballPosition = writable({ x: 0, y: 0 });

export const score = writable({ my: 0, opponent: 0 });

export const isServer = writable(false);

type Message =
    | { type: "join"; from: string }
    | { type: "full" }
    | { type: "joined"; from: string }
    | { type: "start"; from: string }
    | { type: "position"; y: number }
    | { type: "position and ball"; y: number; ball: { x: number; y: number } }
    | { type: "score"; score: { my: number; opponent: number } }
    | { type: "exit" };

export function createPongChannel(peer: RTCPeerConnection) {
    const channel = peer.createDataChannel("pong");

    channel.onmessage = (ev) => {
        const message: Message = JSON.parse(ev.data);
        if (message.type === "join") {
            if (get(opponent)) {
                sendMessage(message.from, { type: "full" });
            } else {
                isServer.set(true);
                sendMessage(message.from, {
                    type: "joined",
                    from: get(userName),
                });
            }
        } else if (message.type === "start") {
            opponent.set(message.from);
        } else if (message.type === "joined") {
            isServer.set(false);
            opponent.set(message.from);
            sendMessage(message.from, { type: "start", from: get(userName) });
        } else if (message.type === "position") {
            opponentPosition.set(message.y);
        } else if (message.type === "position and ball") {
            opponentPosition.set(message.y);
            ballPosition.set(message.ball);
        } else if (message.type === "score") {
            score.set(message.score);
        } else if (message.type === "exit") {
            opponent.set(null);
            display.set(false);
        } else if (message.type === "full") {
            open("Some people are already playing");
        }
    };

    return channel;
}

function sendMessage(to: string, message: Message) {
    const connect = connects.get(to)!;
    connect.pongChannel.send(JSON.stringify(message));
}

export function joinGame(to: string) {
    sendMessage(to, { type: "join", from: get(userName) });
}

export function sendPosition(y: number) {
    sendMessage(get(opponent)!, { type: "position", y });
}

export function sendPositionAndBall(y: number, ball: { x: number; y: number }) {
    sendMessage(get(opponent)!, { type: "position and ball", y, ball });
}

export function sendScore(score: { my: number; opponent: number }) {
    sendMessage(get(opponent)!, {
        type: "score",
        score: { my: score.opponent, opponent: score.my },
    });
}

export function sendExit() {
    sendMessage(get(opponent)!, { type: "exit" });
}
