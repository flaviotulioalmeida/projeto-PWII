import React from 'react';
import Icon from './Icon';

interface WorkspaceModalProps {
  mode: 'create' | 'rename';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ mode, isOpen, onClose, onSubmit, initialName = '' }) => {
  const [name, setName] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setName(initialName);
      // Timeout para permitir que o modal renderize antes de focar
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialName]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };
  
  const title = mode === 'create' ? 'Create New Workspace' : 'Rename Workspace';
  const buttonText = mode === 'create' ? 'Create' : 'Rename';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-full max-w-sm p-6 m-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800" aria-label="Close modal">
              <Icon className="w-6 h-6 text-zinc-400">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </Icon>
            </button>
          </div>
          
          <div className="mb-6">
            <label htmlFor="workspace-name" className="block text-sm font-medium text-zinc-400 mb-2">
              Workspace Name
            </label>
            <input
              ref={inputRef}
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Project"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
              required
            />
          </div>

          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceModal;
