import { Server } from "http";
import { Server as SocketIO } from "socket.io";

const httpServer = new Server();

const io = new SocketIO(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

httpServer.listen(8080);
