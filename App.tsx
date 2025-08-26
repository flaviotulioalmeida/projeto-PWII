import React from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import MessageInput from './components/MessageInput';
import { initializeChat, sendMessageToGeminiStream, startNewChat as resetGeminiChat } from './services/geminiService';
import { Chat, Message, MessageRole, Workspace } from './types';
import Icon from './components/Icon';
import SettingsModal from './components/SettingsModal';

// Função auxiliar para gerar IDs únicos.
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// Modelos de IA disponíveis para seleção.
const AVAILABLE_MODELS = ['gemini-2.5-flash'];

/**
 * Carrega os workspaces do localStorage ou cria um workspace padrão se não houver dados salvos.
 * @returns Um array de workspaces.
 */
const loadInitialWorkspaces = (): Workspace[] => {
    try {
        const savedWorkspaces = localStorage.getItem('workspaces');
        if (savedWorkspaces) {
            const parsed = JSON.parse(savedWorkspaces);
            // Garante que não começamos com um estado vazio se o localStorage tiver '[]'.
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }

        // Cria um workspace padrão se nada for encontrado.
        const defaultWorkspace: Workspace = {
            id: generateId(),
            name: 'Personal Workspace',
            chats: [],
        };
        return [defaultWorkspace];

    } catch (error) {
        console.error("Failed to load or parse workspaces from localStorage. Starting with a fresh workspace.", error);
        // Fallback para um novo workspace em caso de erro.
        return [{
            id: generateId(),
            name: 'Personal Workspace',
            chats: [],
        }];
    }
};

/**
 * Componente principal da aplicação.
 */
const App: React.FC = () => {
    // Estados principais da aplicação.
    const [workspaces, setWorkspaces] = React.useState<Workspace[]>(loadInitialWorkspaces);
    const [activeWorkspaceId, setActiveWorkspaceId] = React.useState<string | null>(null);
    const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    
    // Estado para o modelo de IA selecionado, com persistência no localStorage.
    const [selectedModel, setSelectedModel] = React.useState<string>(() => {
        return localStorage.getItem('selectedModel') || AVAILABLE_MODELS[0];
    });

    // Estado para as notificações, com persistência no localStorage.
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(() => {
        return localStorage.getItem('notificationsEnabled') === 'true';
    });
    // Estado para a permissão de notificação do navegador.
    const [notificationPermission, setNotificationPermission] = React.useState(Notification.permission);


    // Efeito para definir o workspace ativo na inicialização.
    React.useEffect(() => {
        const savedActiveWorkspaceId = localStorage.getItem('activeWorkspaceId');
        let currentActiveId = null;

        // Tenta restaurar o último workspace ativo, senão, usa o primeiro da lista.
        if (savedActiveWorkspaceId && workspaces.some(ws => ws.id === savedActiveWorkspaceId)) {
            currentActiveId = savedActiveWorkspaceId;
        } else if (workspaces.length > 0) {
            currentActiveId = workspaces[0].id;
        }
        setActiveWorkspaceId(currentActiveId);
    }, []); // Executa apenas uma vez na montagem do componente.

    // Efeitos para salvar estados importantes no localStorage sempre que eles mudam.
    React.useEffect(() => {
        try {
            localStorage.setItem('workspaces', JSON.stringify(workspaces));
        } catch (error) {
            console.error("Failed to save workspaces to localStorage", error);
        }
    }, [workspaces]);

    React.useEffect(() => {
        if (activeWorkspaceId) {
            localStorage.setItem('activeWorkspaceId', activeWorkspaceId);
        }
    }, [activeWorkspaceId]);
    
    React.useEffect(() => {
        localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
    }, [notificationsEnabled]);

    React.useEffect(() => {
        localStorage.setItem('selectedModel', selectedModel);
    }, [selectedModel]);


    // Memoriza o objeto do workspace ativo para evitar recálculos desnecessários.
    const activeWorkspace = React.useMemo(() => {
        return workspaces.find(ws => ws.id === activeWorkspaceId);
    }, [workspaces, activeWorkspaceId]);

    // Memoriza o objeto do chat ativo.
    const activeChat = React.useMemo(() => {
        return activeWorkspace?.chats.find(chat => chat.id === activeChatId);
    }, [activeWorkspace, activeChatId]);

    // Memoriza la lista de chats filtrados pela busca.
    const filteredChats = React.useMemo(() => {
        if (!activeWorkspace) return [];
        return activeWorkspace.chats.filter(chat =>
            chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeWorkspace, searchQuery]);

    // Função para criar um novo chat.
    const handleNewChat = () => {
        if (!activeWorkspaceId) return;
        const newChat: Chat = {
            id: generateId(),
            title: 'New Chat',
            messages: [],
            model: selectedModel, // Usa o modelo selecionado nas configurações.
        };
        // Adiciona o novo chat ao início da lista no workspace ativo.
        setWorkspaces(prev => prev.map(ws => 
            ws.id === activeWorkspaceId
                ? { ...ws, chats: [newChat, ...ws.chats] }
                : ws
        ));
        setActiveChatId(newChat.id);
        resetGeminiChat(); // Reseta a sessão de chat no serviço.
    };

    // Função para selecionar um chat existente.
    const handleSelectChat = (id: string) => {
        const selectedChat = activeWorkspace?.chats.find(c => c.id === id);
        if (selectedChat) {
            setActiveChatId(id);
            // Re-inicializa o chat no serviço com o histórico da conversa.
            if (selectedChat.messages.length > 0) {
                initializeChat(selectedChat.messages, selectedChat.model);
            } else {
                resetGeminiChat();
            }
        }
    };

    // Função para deletar um chat.
    const handleDeleteChat = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que o evento de clique selecione o chat.
        if (!activeWorkspaceId) return;

        setWorkspaces(prevWorkspaces => prevWorkspaces.map(ws => {
            if (ws.id !== activeWorkspaceId) return ws;

            const chatIndex = ws.chats.findIndex(c => c.id === id);
            if (chatIndex < 0) return ws;

            const newChats = ws.chats.filter(chat => chat.id !== id);

            // Se o chat deletado era o ativo, seleciona um novo chat ativo.
            if (activeChatId === id) {
                if (newChats.length > 0) {
                    // Tenta selecionar o chat na mesma posição ou o último da lista.
                    const newActiveIndex = Math.min(chatIndex, newChats.length - 1);
                    const newActiveChat = newChats[newActiveIndex];
                    setActiveChatId(newActiveChat.id);
                     // Inicializa o novo chat ativo no serviço Gemini.
                     if (newActiveChat.messages.length > 0) {
                        initializeChat(newActiveChat.messages, newActiveChat.model);
                    } else {
                        resetGeminiChat();
                    }
                } else {
                    // Se não houver mais chats, desativa a seleção.
                    setActiveChatId(null);
                    resetGeminiChat();
                }
            }
            
            return { ...ws, chats: newChats };
        }));
    };
    
    // Função para lidar com a ativação/desativação de notificações.
    const handleNotificationsToggle = async () => {
        if (notificationPermission === 'granted') {
            setNotificationsEnabled(prev => !prev);
        } else if (notificationPermission === 'default') {
            // Se a permissão ainda não foi solicitada, solicita ao usuário.
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === 'granted') {
                setNotificationsEnabled(true);
            }
        }
    };

    // Função para enviar uma mensagem do usuário para a IA.
    const sendMessage = async (text: string) => {
        if (!activeChatId || !activeChat || !activeWorkspaceId) return;

        const isFirstMessage = activeChat.messages.length === 0;
        const userMessage: Message = { role: MessageRole.USER, text };

        // Adiciona a mensagem do usuário ao estado imediatamente para uma UI responsiva.
        setWorkspaces(prev => prev.map(ws => ws.id === activeWorkspaceId 
            ? { ...ws, chats: ws.chats.map(c => c.id === activeChatId ? {...c, messages: [...c.messages, userMessage]} : c) }
            : ws
        ));
        setIsLoading(true);

        const historyForAPI = activeChat.messages;
        const modelForAPI = activeChat.model;

        try {
            // Chama o serviço para obter a resposta da IA em stream.
            const stream = await sendMessageToGeminiStream(historyForAPI, text, modelForAPI);
            let modelResponse = '';

            // Processa cada pedaço (chunk) da resposta do stream.
            for await (const chunk of stream) {
                modelResponse += chunk;
                // Atualiza o estado com a resposta parcial do modelo.
                setWorkspaces(prevWorkspaces => prevWorkspaces.map(ws => {
                    if (ws.id !== activeWorkspaceId) return ws;
                    return {
                        ...ws,
                        chats: ws.chats.map(chat => {
                            if (chat.id !== activeChatId) return chat;
                            
                            const messages = [...chat.messages];
                            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

                            // Se a última mensagem já é do modelo (resposta em andamento), atualiza-a.
                            // Caso contrário, adiciona uma nova mensagem do modelo.
                            if (lastMessage && lastMessage.role === MessageRole.MODEL) {
                                messages[messages.length - 1] = { ...lastMessage, text: modelResponse };
                            } else {
                                messages.push({ role: MessageRole.MODEL, text: modelResponse });
                            }
                            return { ...chat, messages };
                        })
                    };
                }));
            }

            // Se for a primeira mensagem do chat, define o título do chat.
            if (isFirstMessage) {
                const newTitle = text.substring(0, 40) + (text.length > 40 ? '...' : '');
                 setWorkspaces(prev => prev.map(ws => ws.id === activeWorkspaceId
                    ? { ...ws, chats: ws.chats.map(c => c.id === activeChatId ? {...c, title: newTitle} : c) }
                    : ws
                ));
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            // Adiciona uma mensagem de erro ao chat em caso de falha na API.
             setWorkspaces(prev => prev.map(ws => ws.id === activeWorkspaceId
                ? { ...ws, chats: ws.chats.map(c => c.id === activeChatId ? {...c, messages: [...c.messages, { role: MessageRole.MODEL, text: `Error: ${errorMessage}`}]} : c) }
                : ws
            ));
        } finally {
            setIsLoading(false);
            // Envia uma notificação se estiverem ativadas e a aba não estiver em foco.
            if (notificationsEnabled && notificationPermission === 'granted' && document.hidden) {
                new Notification('Gemini Chat', {
                    body: 'Your new message is ready!',
                    icon: '/icons/icon-192.png',
                });
            }
        }
    };

    // Funções para gerenciamento de Workspaces.
    const handleCreateWorkspace = (name: string) => {
        const newWorkspace: Workspace = { id: generateId(), name, chats: [] };
        setWorkspaces(prev => [...prev, newWorkspace]);
        setActiveWorkspaceId(newWorkspace.id);
        setActiveChatId(null);
        resetGeminiChat();
    };

    const handleRenameWorkspace = (id: string, newName: string) => {
        setWorkspaces(prev => prev.map(ws => ws.id === id ? { ...ws, name: newName } : ws));
    };

    const handleDeleteWorkspace = (id: string) => {
        // Impede a exclusão do último workspace.
        if (workspaces.length <= 1) {
            alert("You cannot delete the last workspace.");
            return;
        }

        const newWorkspaces = workspaces.filter(ws => ws.id !== id);
        setWorkspaces(newWorkspaces);

        // Se o workspace deletado era o ativo, muda para o primeiro da nova lista.
        if (activeWorkspaceId === id) {
            const newActiveWorkspace = newWorkspaces.length > 0 ? newWorkspaces[0] : null;
            setActiveWorkspaceId(newActiveWorkspace?.id || null);
            setActiveChatId(null);
            resetGeminiChat();
        }
    };

    // Função para formatar o nome do modelo para exibição.
    const formatModelName = (modelId: string) => {
        if (!modelId) return '';
        return modelId.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="h-screen w-screen bg-zinc-900 text-white flex font-sans">
            <Sidebar 
                onNewChat={handleNewChat} 
                isSidebarOpen={isSidebarOpen}
                chats={filteredChats}
                activeChatId={activeChatId}
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                workspaces={workspaces}
                activeWorkspace={activeWorkspace}
                onSelectWorkspace={setActiveWorkspaceId}
                onCreateWorkspace={handleCreateWorkspace}
                onRenameWorkspace={handleRenameWorkspace}
                onDeleteWorkspace={handleDeleteWorkspace}
            />
            
            <main className="flex-1 flex flex-col relative h-full bg-black">
                <header className="flex-shrink-0 h-16 border-b border-zinc-800 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                         {/* Botão para abrir/fechar a sidebar */}
                         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-zinc-800">
                           <Icon className="w-6 h-6 text-zinc-400">
                            {isSidebarOpen ? <path d="m17 18-6-6 6-6"/> : <path d="m7 18 6-6-6-6"/>}
                            <path d="M7 6v12"/>
                           </Icon>
                        </button>
                        {/* Botão para abrir o modal de configurações */}
                        <button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center gap-2 p-2 rounded-md hover:bg-zinc-800">
                          <h2 className="font-semibold">Quick Settings</h2>
                           <Icon className="w-5 h-5 text-zinc-400">
                              <polyline points="6 9 12 15 18 9"/>
                           </Icon>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{activeChat ? formatModelName(activeChat.model) : 'Gemini Chat'}</span>
                        <Icon className="w-6 h-6 text-zinc-400">
                             <line x1="12" x2="12" y1="2" y2="22" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </Icon>
                    </div>
                </header>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    <ChatView messages={activeChat?.messages || []} isLoading={isLoading} />
                    <MessageInput onSendMessage={sendMessage} isLoading={isLoading} disabled={!activeChatId} />
                </div>
            </main>
            
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                notificationsEnabled={notificationsEnabled && notificationPermission === 'granted'}
                onNotificationsToggle={handleNotificationsToggle}
                notificationPermission={notificationPermission}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                availableModels={AVAILABLE_MODELS}
            />
        </div>
    );
};

export default App;