import http from "http";
import app from "./app.js";
import { WebSocketServer } from "ws";
const port = process.env.PORT ? Number(process.env.PORT) : 3002;
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`HTTP- und WebSocket-Server läuft auf Port ${port}`);
});
const wss = new WebSocketServer({ server });
let nextId = 1;
wss.on("connection", (socket) => {
    socket.clientId = `c${nextId++}`;
    console.log("connection established to", socket.clientId);
    const welcomeMsg = {
        type: "welcome",
        clientId: socket.clientId,
    };
    console.log("message", JSON.stringify(welcomeMsg));
    socket.send(JSON.stringify(welcomeMsg));
    socket.on("message", (data) => {
        console.log("message received");
        const text = String(data);
        const servertext = text + " from Server";
        socket.send(JSON.stringify(servertext));
    });
});
