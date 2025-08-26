
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: MessageRole;
  text: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
}

export interface Workspace {
    id: string;
    name: string;
    chats: Chat[];
}
