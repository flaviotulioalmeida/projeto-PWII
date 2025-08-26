
import React from 'react';
import Icon from './Icon';
import { Chat, Workspace } from '../types';
import WorkspaceModal from './WorkspaceModal';
import ConfirmationModal from './ConfirmationModal';

interface SidebarProps {
  onNewChat: () => void;
  isSidebarOpen: boolean;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  workspaces: Workspace[];
  activeWorkspace: Workspace | undefined;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string) => void;
  onRenameWorkspace: (id: string, name: string) => void;
  onDeleteWorkspace: (id: string) => void;
}

const NavIcon: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active }) => (
    <div className={`p-2 rounded-lg ${active ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}>
        <Icon className="w-6 h-6 text-zinc-400">{children}</Icon>
    </div>
);

const WorkspaceMenu: React.FC<{
    workspaces: Workspace[];
    activeWorkspace: Workspace | undefined;
    onSelectWorkspace: (id: string) => void;
    onClose: () => void;
    onTriggerCreate: () => void;
    onTriggerRename: () => void;
    onTriggerDelete: () => void;
}> = ({ workspaces, activeWorkspace, onSelectWorkspace, onClose, onTriggerCreate, onTriggerRename, onTriggerDelete }) => {
    
    const handleDelete = () => {
        if (!activeWorkspace) return;
        onTriggerDelete();
        onClose();
    };
    
    return (
        <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10 text-sm">
            <div className="p-2">
                <p className="px-2 py-1 text-xs text-zinc-400 font-semibold">Workspaces</p>
                <ul className="mt-1">
                    {workspaces.map(ws => (
                        <li key={ws.id}>
                            <button
                                onClick={() => { onSelectWorkspace(ws.id); onClose(); }}
                                className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded-md ${
                                    activeWorkspace?.id === ws.id ? 'bg-zinc-600 text-white' : 'hover:bg-zinc-700 text-zinc-300'
                                }`}
                            >
                                <span>{ws.name}</span>
                                {activeWorkspace?.id === ws.id && <Icon className="w-4 h-4"><path d="M20 6 9 17l-5-5"/></Icon>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-zinc-700 p-2 space-y-1">
                <button onClick={onTriggerCreate} className="w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-700 text-zinc-300">Create Workspace</button>
                <button onClick={onTriggerRename} disabled={!activeWorkspace} className="w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-700 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed">Rename Workspace</button>
                <button onClick={handleDelete} disabled={!activeWorkspace || workspaces.length <= 1} className="w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-700 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed">Delete Workspace</button>
            </div>
        </div>
    );
};


const Sidebar: React.FC<SidebarProps> = (props) => {
    const { 
        onNewChat, isSidebarOpen, chats, activeChatId, onSelectChat, onDeleteChat, 
        searchQuery, onSearchChange, workspaces, activeWorkspace, onCreateWorkspace, onRenameWorkspace, onDeleteWorkspace
    } = props;
    
    const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = React.useState(false);
    const [workspaceModalState, setWorkspaceModalState] = React.useState<{ mode: 'create' | 'rename' | null }>({ mode: null });
    const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

     React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsWorkspaceMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleTriggerCreate = () => {
        setIsWorkspaceMenuOpen(false);
        setWorkspaceModalState({ mode: 'create' });
    };

    const handleTriggerRename = () => {
        if (!activeWorkspace) return;
        setIsWorkspaceMenuOpen(false);
        setWorkspaceModalState({ mode: 'rename' });
    };

    const handleModalClose = () => {
        setWorkspaceModalState({ mode: null });
    };

    const handleModalSubmit = (name: string) => {
        if (workspaceModalState.mode === 'create') {
            onCreateWorkspace(name);
        } else if (workspaceModalState.mode === 'rename' && activeWorkspace) {
            onRenameWorkspace(activeWorkspace.id, name);
        }
        handleModalClose();
    };

    const handleTriggerDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (activeWorkspace) {
            onDeleteWorkspace(activeWorkspace.id);
        }
    };

    return (
        <>
            <div className={`transition-all duration-300 ease-in-out flex ${isSidebarOpen ? 'w-80' : 'w-16'}`}>
                <div className="bg-black h-full flex flex-col p-3 items-center space-y-4">
                    <NavIcon active>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </NavIcon>
                    <NavIcon>
                        <path d="m12 14 4-4" />
                        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                    </NavIcon>
                    <NavIcon>
                        <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V14c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                        <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                        <path d="M15 2v5h5" />
                    </NavIcon>
                    <NavIcon>
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                    </NavIcon>
                </div>
                <div className={`bg-zinc-900 h-full flex-grow flex flex-col p-3 overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex-shrink-0">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsWorkspaceMenuOpen(prev => !prev)}
                                className="w-full text-left p-2.5 bg-zinc-800 border border-zinc-700 rounded-md flex justify-between items-center text-zinc-200"
                            >
                                <span className="truncate font-semibold">{activeWorkspace?.name || 'No Workspace'}</span>
                                <Icon className="w-4 h-4 text-zinc-400">
                                    <path d="m7 15 5 5 5-5" />
                                    <path d="m7 9 5-5 5 5" />
                                </Icon>
                            </button>
                            {isWorkspaceMenuOpen && <WorkspaceMenu 
                                workspaces={props.workspaces}
                                activeWorkspace={props.activeWorkspace}
                                onSelectWorkspace={props.onSelectWorkspace}
                                onClose={() => setIsWorkspaceMenuOpen(false)}
                                onTriggerCreate={handleTriggerCreate}
                                onTriggerRename={handleTriggerRename}
                                onTriggerDelete={handleTriggerDelete}
                            />}
                        </div>

                        <div className="flex items-center mt-4 space-x-2">
                            <button onClick={onNewChat} className="w-full bg-white text-black font-semibold py-2 px-4 rounded-md flex items-center justify-center">
                                <Icon className="w-5 h-5 mr-2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </Icon>
                                New Chat
                            </button>
                            <button className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400">
                                <Icon className="w-5 h-5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="12" y1="18" x2="12" y2="12" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </Icon>
                            </button>
                        </div>
                        <div className="relative mt-4">
                            <input 
                            type="text" 
                            placeholder="Search chats..." 
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 pl-4 pr-8 text-zinc-300 placeholder-zinc-500" 
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-grow mt-6 overflow-y-auto pr-2">
                        {chats.length > 0 ? (
                            <ul className="space-y-2">
                                {chats.map(chat => (
                                    <li key={chat.id} className="group relative">
                                        <button
                                            onClick={() => onSelectChat(chat.id)}
                                            className={`w-full text-left pl-3 pr-8 py-2 rounded-md truncate text-sm transition-colors ${
                                                activeChatId === chat.id
                                                    ? 'bg-zinc-700 text-white'
                                                    : 'text-zinc-400 hover:bg-zinc-800'
                                            }`}
                                        >
                                            {chat.title}
                                        </button>
                                        <button
                                            onClick={(e) => onDeleteChat(chat.id, e)}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label={`Delete chat: ${chat.title}`}
                                        >
                                            <Icon className="w-4 h-4">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </Icon>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-zinc-500">{searchQuery ? 'No matching chats.' : 'No chats.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <WorkspaceModal
                isOpen={workspaceModalState.mode !== null}
                mode={workspaceModalState.mode || 'create'}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialName={workspaceModalState.mode === 'rename' ? activeWorkspace?.name : ''}
            />
             <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Workspace"
                confirmText="Delete"
            >
                <p>Are you sure you want to delete the workspace "{activeWorkspace?.name}"?</p>
                <p className="mt-2 text-sm text-zinc-400">All chats within this workspace will be permanently removed. This action cannot be undone.</p>
            </ConfirmationModal>
        </>
    );
};

export default Sidebar;
