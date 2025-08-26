import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import { Message, MessageRole } from '../types';

// Verifica se a chave da API foi definida nas variáveis de ambiente.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

// Inicializa o cliente da API Gemini com a chave fornecida.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Variáveis para manter o estado da sessão de chat atual.
let chat: GeminiChat | null = null;
let currentModelForChat: string | null = null;

/**
 * Inicializa ou reinicializa uma sessão de chat com o histórico de mensagens fornecido.
 * @param history O histórico de mensagens para iniciar o chat.
 * @param model O modelo de IA a ser usado.
 */
export function initializeChat(history: Message[], model: string) {
    // Converte o histórico de mensagens do nosso formato para o formato da API Gemini.
    const geminiHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // A API Gemini exige que o histórico alterne entre 'user' e 'model'.
    // Filtramos mensagens consecutivas do mesmo autor para evitar erros.
    const filteredHistory = geminiHistory.filter((msg, i) => {
        if (i === 0) return true;
        return msg.role !== geminiHistory[i - 1].role;
    });

    // Cria uma nova instância de chat com o modelo e histórico especificados.
    chat = ai.chats.create({
        model: model,
        history: filteredHistory,
    });
    currentModelForChat = model;
}


/**
 * Envia uma nova mensagem para a API Gemini e retorna a resposta como um stream.
 * @param history O histórico de mensagens atual da conversa.
 * @param newMessage A nova mensagem a ser enviada pelo usuário.
 * @param model O modelo de IA a ser usado.
 * @returns Um gerador assíncrono que produz pedaços (chunks) da resposta do modelo.
 */
export const sendMessageToGeminiStream = async (
    history: Message[],
    newMessage: string,
    model: string
): Promise<AsyncGenerator<string, void, unknown>> => {

    // Se o chat não foi inicializado ou o modelo mudou, inicializa um novo chat.
    if (!chat || currentModelForChat !== model) {
        initializeChat(history, model);
    }

    // Garante que o chat foi inicializado corretamente.
    if (!chat) {
      throw new Error("Chat not initialized");
    }

    try {
        // Envia a mensagem para a API e obtém o resultado em stream.
        const result = await chat.sendMessageStream({ message: newMessage });
        
        // Cria e retorna um gerador assíncrono para processar o stream.
        const stream = (async function*() {
            for await (const chunk of result) {
                yield chunk.text; // Retorna o texto de cada pedaço do stream.
            }
        })();
        return stream;

    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        // Em caso de erro, reseta a sessão de chat para evitar problemas futuros.
        chat = null;
        currentModelForChat = null;
        throw new Error("Failed to get response from AI. The chat session may have been reset.");
    }
};

/**
 * Reseta o estado do chat atual no serviço.
 */
export const startNewChat = () => {
    chat = null;
    currentModelForChat = null;
}