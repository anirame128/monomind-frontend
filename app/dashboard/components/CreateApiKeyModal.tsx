import { useState } from 'react';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateApiKeyModal({ isOpen, onClose, onCreate }: CreateApiKeyModalProps) {
  const [keyName, setKeyName] = useState("");

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!keyName.trim()) {
      alert("Please enter a key name");
      return;
    }
    await onCreate(keyName);
    setKeyName("");
    onClose();
  };

  const handleClose = () => {
    setKeyName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white font-mono">Create API Key</h3>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Key Name
          </label>
          <input
            type="text"
            placeholder="e.g., Production, Development"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate();
              }
            }}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 font-mono"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            className="flex-1 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Create
          </button>
          <button
            onClick={handleClose}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

