export type WelcomeMessage = {
    type: "welcome";
    clientId: string;
};

export type ChatTextMessage = {
    type: "message";
    from: string;
    name?: string;
    text: string;
    timestamp?: number;
};

export type UserJoinedMessage = {
    type: "user-joined";
    id: string;
    name: string;
};

export type UserGetUsers = {
    type: "get-users";
    users: string[]
}

export type ServerMessage = WelcomeMessage | ChatTextMessage | UserJoinedMessage | UserGetUsers;

