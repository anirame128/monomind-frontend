'use client'

import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ApiKey {
  key: string;
  name: string;
  createdAt: string;
  usage?: number;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyName, setKeyName] = useState("");
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyValue, setShowKeyValue] = useState(false);
  const [deleteKeyModal, setDeleteKeyModal] = useState<ApiKey | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [githubConnected, setGithubConnected] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://monomind-backend-505269802392.us-central1.run.app';

  useEffect(() => {
    if (user) {
      loadApiKeys();
      checkGitHubConnection();
    }
  }, [user]);

  const checkGitHubConnection = async () => {
    // Check URL params first (for immediate feedback after OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('github_connected') === 'true') {
      setGithubConnected(true);
      window.history.replaceState({}, '', '/dashboard');
      return;
    }

    // Then check actual database status
    try {
      const res = await fetch(`${apiUrl}/user/${user?.id}/github-status`);
      const data = await res.json();
      setGithubConnected(data.connected);
    } catch (error) {
      console.error("Failed to check GitHub status", error);
    }
  };

  const connectGitHub = () => {
    window.location.href = `${apiUrl}/auth/github?user_id=${user?.id}`;
  };

  const loadApiKeys = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const url = `${apiUrl}/api-keys/${user?.id}`;
      console.log('Fetching API keys from:', url);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load API keys: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setApiKeys(data || []);
    } catch (error) {
      console.error("Failed to load API keys", error);
      console.error("API URL:", apiUrl);
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    if (!keyName.trim()) {
      alert("Please enter a key name");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api-keys/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: user?.id,
          name: keyName,
        }),
      });
      const data = await res.json();
      setShowNewKey(data.api_key);
      setShowKeyValue(false);
      setKeyName("");
      setShowCreateModal(false);
      loadApiKeys();
    } catch (error) {
      console.error("Failed to generate API key", error);
    }
  };

  const handleDeleteClick = (apiKey: ApiKey) => {
    setDeleteKeyModal(apiKey);
    setDeleteConfirmation("");
  };

  const deleteKey = async () => {
    if (!deleteKeyModal) return;

    const keyNameToMatch = deleteKeyModal.name || "monomind";
    if (deleteConfirmation !== keyNameToMatch) {
      alert("The key name doesn't match. Please type the exact name to confirm deletion.");
      return;
    }

    try {
      await fetch(`${apiUrl}/api-keys/${deleteKeyModal.key}`, {
        method: "DELETE",
      });
      setDeleteKeyModal(null);
      setDeleteConfirmation("");
      loadApiKeys();
    } catch (error) {
      console.error("Failed to delete API key", error);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 12) return key;
    return `${key.slice(0, 12)}...`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const activeKeys = apiKeys.length;

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-lg text-white font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="w-full border-b border-zinc-800 bg-black">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-xl font-semibold text-white font-mono">
            monomind
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Create Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white font-mono">Create API Key</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setKeyName("");
                  }}
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
                      generateKey();
                    }
                  }}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 font-mono"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={generateKey}
                  className="flex-1 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setKeyName("");
                  }}
                  className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Key Modal */}
        {showNewKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white font-mono">API Key Created</h3>
                <button
                  onClick={() => {
                    setShowNewKey(null);
                    setShowKeyValue(false);
                  }}
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
                  {showKeyValue ? showNewKey : '•'.repeat(40)}
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
                  onClick={() => {
                    if (showNewKey) {
                      navigator.clipboard.writeText(showNewKey);
                      alert("API key copied to clipboard!");
                    }
                  }}
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
                  onClick={() => {
                    setShowNewKey(null);
                    setShowKeyValue(false);
                  }}
                  className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Key Confirmation Modal */}
        {deleteKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white font-mono">Delete API Key</h3>
                <button
                  onClick={() => {
                    setDeleteKeyModal(null);
                    setDeleteConfirmation("");
                  }}
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
                To confirm, type the key name: <span className="font-mono text-white">{deleteKeyModal.name || "monomind"}</span>
              </p>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter key name to confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      deleteKey();
                    }
                  }}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={deleteKey}
                  disabled={deleteConfirmation !== (deleteKeyModal.name || "monomind")}
                  className="flex-1 rounded-md bg-red-900/50 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-900/50"
                >
                  Delete Key
                </button>
                <button
                  onClick={() => {
                    setDeleteKeyModal(null);
                    setDeleteConfirmation("");
                  }}
                  className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Connection Card */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-white font-mono">GitHub Connection</h2>
          </div>
          <div className="px-6 py-6">
            {githubConnected ? (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900/50">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">GitHub Connected</p>
                  <p className="text-sm text-zinc-400">You can now add repositories to index</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-zinc-300">
                  Connect your GitHub account to index your repositories and enable automatic syncing.
                </p>
                <button
                  onClick={connectGitHub}
                  className="flex items-center gap-3 rounded-md bg-zinc-800 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Connect GitHub Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* API Keys Section */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          {/* Header with Title and Create Button */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-white font-mono">
              API Keys ({activeKeys})
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              CREATE KEY
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {apiKeys.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-zinc-400 font-mono">
                  No API keys yet. Create one to get started!
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {apiKeys.map((apiKey) => (
                    <tr key={apiKey.key} className="hover:bg-zinc-800/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white font-mono">
                        {apiKey.name || "monomind"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300 font-mono">
                        {maskKey(apiKey.key)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
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
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDate(apiKey.createdAt)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className="inline-flex items-center rounded-md bg-green-900/50 px-2 py-1 text-xs font-medium text-green-100">
                          Active
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
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
                              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                            />
                          </svg>
                          {apiKey.usage || 0}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => handleDeleteClick(apiKey)}
                          className="inline-flex items-center justify-center rounded-md bg-red-900/50 p-2 text-red-100 hover:bg-red-800/50 transition-colors"
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
