import React from 'react';
import Icon from './Icon';

// Define as propriedades para o componente de entrada de mensagem.
interface MessageInputProps {
  onSendMessage: (message: string) => void; // Função para ser chamada quando uma mensagem é enviada.
  isLoading: boolean; // Indica se uma resposta está sendo carregada.
  disabled?: boolean; // Desabilita o campo de entrada (ex: se nenhum chat estiver selecionado).
}

/**
 * Componente de formulário para o usuário digitar e enviar mensagens.
 */
const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  // Estado para armazenar o texto da mensagem atual.
  const [message, setMessage] = React.useState('');

  // Função para lidar com o envio do formulário.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previne o recarregamento da página.
    // Verifica se a mensagem não está vazia e se não há carregamento em andamento.
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim()); // Chama a função do pai para enviar a mensagem.
      setMessage(''); // Limpa o campo de entrada.
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex-shrink-0">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-6 h-6 text-zinc-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </Icon>
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          disabled={isLoading || disabled}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-4 pl-12 pr-14 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim() || disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-700 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white"
        >
          <Icon className="w-5 h-5">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </Icon>
        </button>
      </form>
      {/* Botão de ajuda */}
      <div className="absolute right-4 bottom-4">
        <button className="w-8 h-8 rounded-full bg-zinc-700 text-zinc-300 flex items-center justify-center">?</button>
      </div>
    </div>
  );
};

export default MessageInput;