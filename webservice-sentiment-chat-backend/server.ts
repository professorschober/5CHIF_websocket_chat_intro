import http from "http";
import app from "./app.js";
import { WebSocketServer, WebSocket } from "ws";
import {ClientMessage, GetUsersMessage} from "./types/clientmessages";
import {ChatMessage, UserJoinedMessage, WelcomeMessage} from "./types/servermessages";
import {ExtendedWebSocket} from "./types/extendedwebsocket";

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
const clientsById = new Map<string, ClientWebSocket>()
const names = new Map<string, string>();

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
    clientsById.set(socket.clientId, socket);
    console.log("connection established to", socket.clientId);

    const welcomeMsg: WelcomeMessage = {
        type: "welcome" as const,
        clientId: socket.clientId,
    };

    console.log("message", JSON.stringify(welcomeMsg));
    socket.send(JSON.stringify(welcomeMsg));

    const defaultName = `Guest-${socket.clientId.slice(1)}`;
    names.set(socket.clientId, defaultName);

    const joinedMsg: UserJoinedMessage = {
        type: "user-joined",
        id: socket.clientId,
        name: defaultName
    }
    const json = JSON.stringify(joinedMsg);
    console.log("user-joined", JSON.stringify(json));
    for (const client of wss.clients) {
        const ws = client as ExtendedWebSocket;
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(json);
        }
    }

    socket.on("message", (data: WebSocket.RawData) => {
        console.log("message received", data);
        const text = String(data);
        const clientId = socket.clientId!;
        let msg = JSON.parse(String(data))
        console.log("message received", msg);
        try {
            msg = JSON.parse(String(data)) as ClientMessage;
            console.log("message", msg);
        } catch {
            console.error("Ungültige Nachricht (kein JSON):", String(data));
            return;
        }
        switch (msg.type) {
            case "message": {
                const payload: ChatMessage = {
                    type: "message",
                    from: clientId,
                    name: "",
                    text: msg.text,
                    ts: Date.now(),
                };
                try {
                    const json = JSON.stringify(payload);
                    socket.send(json);
                }
                catch {
                    console.warn("Kein gültiges JSON, sende als Text zurück.");
                }
                break;
            }
            case "broadcast": {
                const payload: ChatMessage = {
                    type: "message",
                    from: clientId,
                    name: "",
                    text: msg.text,
                    ts: Date.now(),
                };
                const json = JSON.stringify(payload);
                for(const client of wss.clients) {
                    const ws = client as ExtendedWebSocket;
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(json);
                    }
                }
                break;
            }
            case "get-users": {
                const valuesArray: string[] = [...names.values()];
                const payload: GetUsersMessage = {
                    type: "get-users",
                    users: valuesArray
                }
                const json = JSON.stringify(payload);
                console.log("get-users", json);
                socket.send(json);
                break;
            }
        }
    });
    socket.on("close", () => {
        const id = socket.clientId!;
        console.log("disconnected:", id);
    });
});