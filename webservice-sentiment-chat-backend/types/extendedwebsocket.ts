export interface ExtendedWebSocket extends WebSocket {
    clientId?: string;
    groupId?: string;
}