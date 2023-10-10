import { Server } from "http";
import { Server as SocketIO } from "socket.io";

const httpServer = new Server();

const io = new SocketIO(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

const members: Map<string, string[]> = new Map();

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
        const clientsInRoom = io.sockets.adapter.rooms.get(room);
        const numClients = clientsInRoom ? clientsInRoom.size : 0;

        if (numClients === 0) {
            socket.join(room);
            socket.emit("created");
            members.set(room, [socket.id]);
        } else if (numClients < 4) {
            io.sockets.in(room).emit("join", socket.id);
            socket.join(room);
            socket.emit("joined", members.get(room));
            io.sockets.in(room).emit("ready");
            members.set(room, [...members.get(room)!, socket.id]);
        } else {
            socket.emit("full", room);
        }
    });
});

httpServer.listen(8080);
