'use client'

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useApiKeys } from '../hooks/useApiKeys';
import { useGitHub } from '../hooks/useGitHub';
import { SidebarNavigation } from './SidebarNavigation';
import { CodebasesTable } from './CodebasesTable';
import { ApiKeysTable } from './ApiKeysTable';
import { AddRepositoryModal } from './AddRepositoryModal';
import { CreateApiKeyModal } from './CreateApiKeyModal';
import { NewApiKeyModal } from './NewApiKeyModal';
import { DeleteApiKeyModal } from './DeleteApiKeyModal';
import type { ActiveSection, ApiKey } from '../lib/types';

export function DashboardContent() {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState<ActiveSection>('codebases');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [deleteKeyModal, setDeleteKeyModal] = useState<ApiKey | null>(null);
  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);
  const [addingRepoId, setAddingRepoId] = useState<number | null>(null);

  const {
    apiKeys,
    createApiKey,
    deleteApiKey,
  } = useApiKeys(user?.id);

  const {
    githubConnected,
    githubError,
    repositories,
    reposLoading,
    reposError,
    indexedCodebases,
    codebasesLoading,
    loadRepositories,
    loadIndexedCodebases,
    connectGitHub,
    addRepository: addRepositoryApi,
  } = useGitHub(user?.id);

  const handleOpenAddRepoModal = async () => {
    if (!githubConnected || !user?.id) {
      connectGitHub();
      return;
    }

    if (repositories.length === 0) {
      await loadRepositories();
    }
    setShowAddRepoModal(true);
  };

  const handleAddRepository = async (githubRepoId: number) => {
    if (!user?.id) return;

    setAddingRepoId(githubRepoId);
    try {
      await addRepositoryApi(githubRepoId);
      setShowAddRepoModal(false);
      setSelectedRepoId(null);
      // Error toast is already handled in the hook
    } catch (error) {
      console.error("Failed to add repository", error);
      // Error toast is already handled in the hook
    } finally {
      setAddingRepoId(null);
    }
  };

  const handleCreateApiKey = async (name: string) => {
    try {
      const apiKey = await createApiKey(name);
      setShowNewKey(apiKey);
      setShowCreateModal(false);
      // Success toast is already handled in the hook
    } catch (error) {
      console.error("Failed to generate API key", error);
      // Error toast is already handled in the hook
    }
  };

  const handleDeleteApiKey = async () => {
    if (!deleteKeyModal) return;
    try {
      await deleteApiKey(deleteKeyModal.key);
      setDeleteKeyModal(null);
      // Success toast is already handled in the hook
    } catch (error) {
      console.error("Failed to delete API key", error);
      // Error toast is already handled in the hook
    }
  };

  return (
    <div className="flex flex-1">
      <SidebarNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Indexed Codebases Section */}
        {activeSection === 'codebases' && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="text-2xl font-bold text-white font-mono">
                Indexed Codebases ({indexedCodebases.length})
              </h2>
              {githubConnected && (
                <button
                  onClick={handleOpenAddRepoModal}
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
                  Add Repository
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <CodebasesTable
                codebases={indexedCodebases}
                loading={codebasesLoading}
                githubConnected={githubConnected}
                onAddRepository={handleOpenAddRepoModal}
                onConnectGitHub={connectGitHub}
              />
            </div>
          </div>
        )}

        {/* API Keys Section */}
        {activeSection === 'api-keys' && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="text-2xl font-bold text-white font-mono">
                API Keys ({apiKeys.length})
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

            <div className="overflow-x-auto">
              <ApiKeysTable
                apiKeys={apiKeys}
                onDeleteClick={setDeleteKeyModal}
              />
            </div>
          </div>
        )}

        {/* Modals */}
        <CreateApiKeyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateApiKey}
        />

        <NewApiKeyModal
          apiKey={showNewKey}
          onClose={() => setShowNewKey(null)}
        />

        <DeleteApiKeyModal
          apiKey={deleteKeyModal}
          onClose={() => setDeleteKeyModal(null)}
          onDelete={handleDeleteApiKey}
        />

        <AddRepositoryModal
          isOpen={showAddRepoModal}
          repositories={repositories}
          loading={reposLoading}
          addingRepoId={addingRepoId}
          selectedRepoId={selectedRepoId}
          onClose={() => setShowAddRepoModal(false)}
          onSelectRepo={setSelectedRepoId}
          onLoadRepositories={loadRepositories}
          onAddRepository={handleAddRepository}
        />
      </main>
    </div>
  );
}

