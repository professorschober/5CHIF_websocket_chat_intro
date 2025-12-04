export type WelcomeMessage = {
    type: "welcome";
    clientId: string;
};

export type LeaveMessage = {
    type: "leave";
    clientId: string;
    name?: string | null;
};

export type UserJoinedMessage = {
    type: "user-joined";
    id: string;
    name: string;
};

export type ChatMessage = {
    type: "message";
    from: string;
    name: string;
    text: string;
    ts: number;
};
export type ServerMessage =
    WelcomeMessage | ChatMessage | LeaveMessage | UserJoinedMessage;