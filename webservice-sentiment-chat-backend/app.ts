import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

app.get("/", (_req, res) => {
    res.send("HTTP-Teil läuft. WebSockets sind unter ws://localhost:3001 erreichbar.");
});

export default app;