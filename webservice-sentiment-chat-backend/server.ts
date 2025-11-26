import http from "http";
import app from "./app.js";
import { WebSocketServer, WebSocket } from "ws";

interface ClientWebSocket extends WebSocket {
    clientId: string;
}

const port: number = process.env.PORT ? Number(process.env.PORT) : 3005;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`HTTP- und WebSocket-Server läuft auf Port ${port}`);
});



const wss = new WebSocketServer({ server });

let nextId = 1;

wss.on("connection", (socket: ClientWebSocket) => {
    socket.clientId = `c${nextId++}`;
    console.log("connection established to", socket.clientId);

    const welcomeMsg = {
        type: "welcome" as const,
        clientId: socket.clientId,
    };

    console.log("message", JSON.stringify(welcomeMsg));
    socket.send(JSON.stringify(welcomeMsg));

    socket.on("message", (data: WebSocket.RawData) => {
        console.log("message received");
        const text = String(data);
        const servertext = text + " from Server";
        socket.send(JSON.stringify(servertext));
    });
});