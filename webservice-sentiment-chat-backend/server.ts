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

wss.on("close", () => {
        console.log("connection closed");
    }
)

wss.on("error", (err) => {
    console.log("error");
    console.log(err.message);
})

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
        console.log("message received", data);
        const text = String(data);
        const clientId = socket.clientId!;
        let msg = JSON.parse(String(data))
        console.log("message received", msg);
        const payload = {
            type: "message",
            from: clientId,
            text: msg.text
        };
        try {
            const json = JSON.stringify(payload);
            socket.send(json);
        }
        catch {
            console.warn("Kein gültiges JSON, sende als Text zurück.");
        }
    });
    socket.on("close", () => {
        const id = socket.clientId!;
        console.log("disconnected:", id);
    });
});