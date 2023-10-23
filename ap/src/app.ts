import { Server } from "http";
import { Server as SocketIO } from "socket.io";

const httpServer = new Server();

const io = new SocketIO(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

const membersMap: Map<string, string[]> = new Map();

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on(
        "offer",
        (room: string, to: string, from: string, sdp: string) => {
            io.sockets.in(room).emit("offer", to, from, sdp);
        }
    );

    socket.on(
        "answer",
        (room: string, to: string, from: string, sdp: string) => {
            io.sockets.in(room).emit("answer", to, from, sdp);
        }
    );

    socket.on(
        "candidate",
        (room: string, to: string, from: string, candidate: string) => {
            io.sockets.in(room).emit("candidate", to, from, candidate);
        }
    );

    socket.on("create or join", (room: string) => {
        const numMembers = membersMap.get(room)?.length ?? 0;

        if (numMembers === 0) {
            socket.join(room);
            socket.emit("created");
            membersMap.set(room, [socket.id]);
        } else if (numMembers < 4) {
            io.sockets.in(room).emit("join", socket.id);
            socket.join(room);
            socket.emit("joined", membersMap.get(room));
            io.sockets.in(room).emit("ready");
            membersMap.set(room, [...membersMap.get(room)!, socket.id]);
        } else {
            socket.emit("full", room);
        }
    });
});

httpServer.listen(8080);
