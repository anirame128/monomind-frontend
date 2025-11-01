import type { GitHubRepository } from '../lib/types';

interface AddRepositoryModalProps {
  isOpen: boolean;
  repositories: GitHubRepository[];
  loading: boolean;
  addingRepoId: number | null;
  selectedRepoId: number | null;
  onClose: () => void;
  onSelectRepo: (repoId: number | null) => void;
  onLoadRepositories: () => Promise<void>;
  onAddRepository: (githubRepoId: number) => Promise<void>;
}

export function AddRepositoryModal({
  isOpen,
  repositories,
  loading,
  addingRepoId,
  selectedRepoId,
  onClose,
  onSelectRepo,
  onLoadRepositories,
  onAddRepository,
}: AddRepositoryModalProps) {

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!selectedRepoId) {
      alert("Please select a repository");
      return;
    }
    await onAddRepository(selectedRepoId);
    onSelectRepo(null);
  };

  const handleClose = () => {
    onSelectRepo(null);
    onClose();
  };

  const selectedRepo = repositories.find((r) => r.githubId === selectedRepoId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white font-mono">Add Repository</h3>
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
        
        {loading ? (
          <div className="py-8 text-center">
            <p className="text-zinc-400 font-mono">Loading repositories...</p>
          </div>
        ) : repositories.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-zinc-400 font-mono mb-4">No repositories found.</p>
            <button
              onClick={onLoadRepositories}
              className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Load Repositories
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-2 font-mono">
                Select Repository
              </label>
              <div className="relative">
                <select
                  value={selectedRepoId || ""}
                  onChange={(e) => onSelectRepo(e.target.value ? Number(e.target.value) : null)}
                  className="w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 pr-10 text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 font-mono transition-colors hover:bg-zinc-700/80 cursor-pointer"
                >
                  <option value="" className="bg-zinc-800 text-zinc-400">Choose a repository...</option>
                  {repositories
                    .filter((repo) => !repo.isIndexed)
                    .map((repo) => (
                      <option key={repo.githubId} value={repo.githubId} className="bg-zinc-800 text-white">
                        {repo.fullName}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
            
            {selectedRepo && (
              <div className="mb-4 rounded-md border border-zinc-700 bg-zinc-800 p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Description:</span>
                    <span className="text-sm text-zinc-300">{selectedRepo.description || "No description"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Visibility:</span>
                    <span className="text-sm text-zinc-300">{selectedRepo.private ? "Private" : "Public"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Default Branch:</span>
                    <span className="text-sm text-zinc-300 font-mono">{selectedRepo.defaultBranch}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!selectedRepoId || addingRepoId !== null}
                className="flex-1 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              >
                Add Repository
              </button>
              <button
                onClick={handleClose}
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

