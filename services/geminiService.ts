import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import { Message, MessageRole } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: GeminiChat | null = null;
let currentModelForChat: string | null = null;

export function initializeChat(history: Message[], model: string) {
    const geminiHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // The Gemini API requires the history to alternate between user and model.
    // We filter out any consecutive messages from the same role before starting.
    const filteredHistory = geminiHistory.filter((msg, i) => {
        if (i === 0) return true;
        return msg.role !== geminiHistory[i - 1].role;
    });

    chat = ai.chats.create({
        model: model,
        history: filteredHistory,
    });
    currentModelForChat = model;
}


export const sendMessageToGeminiStream = async (
    history: Message[],
    newMessage: string,
    model: string
): Promise<AsyncGenerator<string, void, unknown>> => {

    if (!chat || currentModelForChat !== model) {
        initializeChat(history, model);
    }

    if (!chat) {
      throw new Error("Chat not initialized");
    }

    try {
        const result = await chat.sendMessageStream({ message: newMessage });
        const stream = (async function*() {
            for await (const chunk of result) {
                yield chunk.text;
            }
        })();
        return stream;

    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        // In case of an error that invalidates the chat, reset it.
        chat = null;
        currentModelForChat = null;
        throw new Error("Failed to get response from AI. The chat session may have been reset.");
    }
};

export const startNewChat = () => {
    chat = null;
    currentModelForChat = null;
}
