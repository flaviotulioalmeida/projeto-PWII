
// Define os papéis possíveis em uma mensagem de chat.
export enum MessageRole {
  USER = 'user',  // Mensagem do usuário
  MODEL = 'model', // Mensagem do modelo (IA)
}

// Define a estrutura de uma única mensagem no chat.
export interface Message {
  role: MessageRole; // Quem enviou a mensagem
  text: string;      // O conteúdo da mensagem
}

// Define a estrutura de uma sessão de chat.
export interface Chat {
  id: string;        // Identificador único do chat
  title: string;     // Título do chat (geralmente baseado na primeira mensagem)
  messages: Message[]; // Array de mensagens no chat
  model: string;     // Modelo de IA usado no chat
}

// Define a estrutura de um workspace, que agrupa vários chats.
export interface Workspace {
    id: string;        // Identificador único do workspace
    name: string;      // Nome do workspace
    chats: Chat[];     // Array de chats pertencentes a este workspace
}