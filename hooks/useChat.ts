import React from 'react';
import { sendMessageToGeminiStream, startNewChat as resetGeminiChat } from '../services/geminiService';
import { Message, MessageRole } from '../types';

export const useChat = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const startNewChat = React.useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    resetGeminiChat();
  }, []);

  const sendMessage = React.useCallback(async (text: string, model: string) => {
    const userMessage: Message = { role: MessageRole.USER, text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);
    
    try {
      const stream = await sendMessageToGeminiStream(messages, text, model);
      let modelResponse = '';
      setMessages(prev => [...prev, { role: MessageRole.MODEL, text: '...' }]);

      for await (const chunk of stream) {
        modelResponse += chunk;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === MessageRole.MODEL) {
            return [...prev.slice(0, -1), { role: MessageRole.MODEL, text: modelResponse }];
          }
          return prev;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
       setMessages(prev => [...prev.slice(0, -1), { role: MessageRole.MODEL, text: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, isLoading, error, sendMessage, startNewChat };
};