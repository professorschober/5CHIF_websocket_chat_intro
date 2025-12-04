import React, {type FormEvent, useEffect, useRef, useState} from 'react';
import type {ServerMessage} from "../servermessages.ts";

const WS_PATH = "ws://localhost:3005";

const Chat = () => {
    const [messages, setMessages] = useState<ServerMessage[]>([]);
    const [text, setText] = useState("");
    const [users, setUsers] = useState<string[]>([])
    const wsRef =
        useRef<WebSocket | null>(null);
    useEffect(() => {
        console.log("useEffect");
       const ws = new WebSocket(WS_PATH);
       wsRef.current = ws;
       ws.onopen = () => {
           console.log("WebSocket connected");
           const getUsersMsg = JSON.stringify({
               type: "get-users"
           });
           console.log("send get-users");
           ws.send(getUsersMsg);
       }
       ws.onmessage = (e) => {
           const raw = String(e.data);
           console.log("raw message", raw);

           let msg : ServerMessage;
           try {
               msg = JSON.parse(raw);
               console.log("parsed message:", msg);
               setMessages((prev) => [...prev, msg]);
               switch (msg.type) {
                   case "welcome":
                        console.log("Willkommen, Client:", msg.clientId);
                        break;
                   case "message":
                       console.log("Chat-Message von", msg.from, ":", msg.text);
                       break;
                   case "get-users":
                       console.log("Willkommen, users:", msg.users);
                       setUsers(msg.users);
                       break;
               }
           }
           catch {
               console.warn("Nachricht konnte nicht geparsed werden.");
               return;
           }

       }
    },[]);

    const sendMessage = (e: FormEvent)=> {
        e.preventDefault();
        const ws = wsRef.current;
        if(ws === null || ws.readyState !== WebSocket.OPEN) return;
        console.log("sendMessage", text);

        const message = JSON.stringify({
            type: "message",
            text: text
        });
        ws.send(message);
        setText("");
    };

    const broadcastMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const ws = wsRef.current;
        if (!text.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
        console.log("broadcastMessage", text)

        const message = JSON.stringify({
            type: "broadcast",
            text: text
        })
        ws.send(message);
        setText("");
    };

    return (
            <div style={{ flex: 2, display: "flex",
                flexDirection: "column", margin: "2rem auto",
                fontFamily: "system-ui, sans-serif"}}>
                <h2>Chat</h2>
                <ul>
                {messages.map((msg, i) => (
                    <li key={i} style={{ marginBottom: 6, padding: "6px 8px",
                        border: "1px solid #ddd", borderRadius: 6 }}>
                        {msg.type === "welcome" && (
                            <>
                                <strong>Willkommen:</strong> Deine Client-ID ist {msg.clientId}
                            </>
                        )}
                        {msg.type === "message" && (
                            <>
                                <strong>{msg.from}:</strong> {msg.text}
                            </>
                        )}
                        {msg.type === "user-joined" && (
                            <>
                                <strong>Beigetreten:</strong> {msg.name} ({msg.id})
                            </>
                        )}
                    </li>
                    ))}
                </ul>
                <form id="f" onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
                    <input
                        id="m"
                        placeholder="Nachricht..."
                        autoComplete="off"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ flex: 1, padding: 8 }}
                    />
                    <button type="submit">Message senden</button>
                </form>
                <form id="f" onSubmit={broadcastMessage} style={{ display: "flex", gap: 8 }}>
                    <button type="submit">Broadcast senden</button>
                </form>
                <ul id="msgs" style={{ listStyle: "none", padding: 0 }}>
                    {users.map((msg, i) => (
                        <li key={i} style={{ marginBottom: 6, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6 }}>
                            {msg}
                        </li>
                    ))
                    }
                </ul>
            </div>
    );
};

export default Chat;