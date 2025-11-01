import { useState } from 'react';

interface NewApiKeyModalProps {
  apiKey: string | null;
  onClose: () => void;
}

export function NewApiKeyModal({ apiKey, onClose }: NewApiKeyModalProps) {
  const [showKeyValue, setShowKeyValue] = useState(false);

  if (!apiKey) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API key copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white font-mono">API Key Created</h3>
          <button
            onClick={onClose}
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
          Make sure to copy your API key now. You won't be able to see it again!
        </p>
        <div className="mb-4 flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3">
          <code className="flex-1 min-w-0 overflow-x-auto font-mono text-sm text-white whitespace-nowrap">
            {showKeyValue ? apiKey : '•'.repeat(40)}
          </code>
          <button
            onClick={() => setShowKeyValue(!showKeyValue)}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label={showKeyValue ? "Hide key" : "Show key"}
          >
            {showKeyValue ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L3 3m0 0a2.25 2.25 0 00-.586 1.414M3 3l3.228 3.228M15.774 15.774L21 21m-3.228-3.228L21 21m0 0a2.25 2.25 0 01-.586-1.414M21 21l-3.228-3.228M15.774 15.774a10.45 10.45 0 01-3.774 2.774M15.774 15.774L12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.667A3.75 3.75 0 0012 2.25a3.75 3.75 0 00-3.666 1.417A3.75 3.75 0 004.5 6.75v6.75a3.75 3.75 0 003.834 3.75h7.332A3.75 3.75 0 0019.5 13.5V6.75a3.75 3.75 0 00-3.834-3.083zM12 17.25a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75z"
              />
            </svg>
            Copy
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

