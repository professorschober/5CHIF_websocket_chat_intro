export interface ChatTextMessage {
    type: "message";
    text: string;
}

export interface BroadcastTextMessage {
    type: "broadcast";
    text: string;
}

export interface GetUsersMessage {
    type: "get-users";
    users: string[];
}

export type ClientMessage = ChatTextMessage | BroadcastTextMessage | GetUsersMessage;