
import React from 'react';
import Icon from './Icon';
import { Message, MessageRole } from '../types';

// Define as propriedades para o componente ChatView.
interface ChatViewProps {
  messages: Message[]; // Array de mensagens a serem exibidas.
  isLoading: boolean;  // Indicador de que o modelo está gerando uma resposta.
}

// Componente para renderizar um único balão de chat.
const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === MessageRole.USER;
    return (
        <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
            {/* Ícone do modelo (IA) */}
            {!isUser && (
                 <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-zinc-300">
                        <path d="m12 14 4-4" />
                        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                    </Icon>
                </div>
            )}
            {/* Conteúdo da mensagem */}
            <div className={`max-w-xl p-4 rounded-lg ${isUser ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-800 text-zinc-300'}`}>
                {/* A propriedade whitespace-pre-wrap preserva espaços e quebras de linha */}
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
             {/* Ícone do usuário */}
             {isUser && (
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 text-zinc-300 font-bold">
                    U
                </div>
            )}
        </div>
    );
};


/**
 * Componente que exibe a conversa do chat, incluindo mensagens e indicador de carregamento.
 */
const ChatView: React.FC<ChatViewProps> = ({ messages, isLoading }) => {
    // Referência a um elemento no final da lista de mensagens para scroll automático.
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Efeito para rolar a visão para a última mensagem sempre que a lista de mensagens ou o estado de carregamento mudar.
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Exibe uma tela inicial se não houver mensagens.
    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-black text-2xl font-bold">UI</span>
                </div>
                <h1 className="text-4xl font-bold">Chatbot UI</h1>
            </div>
        );
    }

    // Renderiza a lista de mensagens e o indicador de carregamento.
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
                <ChatBubble key={index} message={msg} />
            ))}
            {/* Indicador de "digitando..." do modelo */}
            {isLoading && (
                <div className="flex items-start gap-4">
                     <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-zinc-300">
                            <path d="m12 14 4-4" />
                            <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                        </Icon>
                    </div>
                    <div className="max-w-xl p-4 rounded-lg bg-zinc-800 text-zinc-300">
                        <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                           <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                           <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
            {/* Elemento de referência para o scroll automático */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatView;
