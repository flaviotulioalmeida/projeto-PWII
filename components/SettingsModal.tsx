
import React from 'react';
import Icon from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: () => void;
  notificationPermission: NotificationPermission;
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: string[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notificationsEnabled,
  onNotificationsToggle,
  notificationPermission,
  selectedModel,
  onModelChange,
  availableModels,
}) => {
  if (!isOpen) {
    return null;
  }

  const isPermissionDenied = notificationPermission === 'denied';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-full max-w-md p-6 m-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quick Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800" aria-label="Close settings">
            <Icon className="w-6 h-6 text-zinc-400">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </Icon>
          </button>
        </div>

        <div className="divide-y divide-zinc-700">
          <div className="py-3">
            <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Enable Notifications</h3>
                  <p className="text-sm text-zinc-400">
                    Get notified when a response is ready and you're on another tab.
                  </p>
                  {isPermissionDenied && (
                    <p className="text-xs text-red-400 mt-1">
                      Notification permission has been denied in your browser settings.
                    </p>
                  )}
                </div>
                <button
                  onClick={onNotificationsToggle}
                  disabled={isPermissionDenied}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white ${
                    notificationsEnabled ? 'bg-white' : 'bg-zinc-700'
                  } ${isPermissionDenied ? 'opacity-50 cursor-not-allowed' : ''}`}
                  role="switch"
                  aria-checked={notificationsEnabled}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-zinc-900 rounded-full transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
            </div>
          </div>
           <div className="py-3">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-medium">AI Model</h3>
                    <p className="text-sm text-zinc-400">
                    Select the Gemini model for new chats.
                    </p>
                </div>
                <select
                    value={selectedModel}
                    onChange={(e) => onModelChange(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-md py-1 px-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    aria-label="Select AI Model"
                >
                    {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                    ))}
                </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
