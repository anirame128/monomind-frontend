import { useState } from 'react';
import type { ApiKey } from '../lib/types';

interface DeleteApiKeyModalProps {
  apiKey: ApiKey | null;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteApiKeyModal({ apiKey, onClose, onDelete }: DeleteApiKeyModalProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  if (!apiKey) return null;

  const keyNameToMatch = apiKey.name || "monomind";

  const handleDelete = async () => {
    if (deleteConfirmation !== keyNameToMatch) {
      alert("The key name doesn't match. Please type the exact name to confirm deletion.");
      return;
    }
    await onDelete();
    setDeleteConfirmation("");
    onClose();
  };

  const handleClose = () => {
    setDeleteConfirmation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white font-mono">Delete API Key</h3>
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
        <p className="mb-4 text-sm text-zinc-400">
          This action cannot be undone. This will permanently delete the API key.
        </p>
        <p className="mb-2 text-sm font-medium text-zinc-300">
          To confirm, type the key name: <span className="font-mono text-white">{keyNameToMatch}</span>
        </p>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter key name to confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleDelete();
              }
            }}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleteConfirmation !== keyNameToMatch}
            className="flex-1 rounded-md bg-red-900/50 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-900/50"
          >
            Delete Key
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

