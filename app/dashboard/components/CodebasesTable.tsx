import type { IndexedCodebase } from '../lib/types';
import { formatDate } from '../lib/utils';

interface CodebasesTableProps {
  codebases: IndexedCodebase[];
  loading: boolean;
  githubConnected: boolean;
  onAddRepository: () => void;
  onConnectGitHub: () => void;
}

export function CodebasesTable({
  codebases,
  loading,
  githubConnected,
  onAddRepository,
  onConnectGitHub,
}: CodebasesTableProps) {
  if (!githubConnected) {
    return (
      <div className="px-6 py-24 text-center">
        <button
          onClick={onConnectGitHub}
          className="flex items-center gap-3 mx-auto rounded-md bg-zinc-800 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Connect GitHub Account
        </button>
      </div>
    );
  }

  if (loading && codebases.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-zinc-400 font-mono">Loading codebases...</p>
      </div>
    );
  }

  if (codebases.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-zinc-400 font-mono mb-4">
          No indexed codebases yet. Add a repository to get started!
        </p>
        <button
          onClick={onAddRepository}
          className="flex items-center gap-2 mx-auto rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
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
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="border-b border-zinc-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
            Repository
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
            Branch
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
            Created
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800">
        {codebases.map((codebase) => (
          <tr key={codebase.id} className="hover:bg-zinc-800/50">
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white font-mono">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {codebase.fullName}
              </div>
              {codebase.description && (
                <p className="text-xs text-zinc-500 mt-1 truncate max-w-md">
                  {codebase.description}
                </p>
              )}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400 font-mono">
              {codebase.defaultBranch}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm">
              <span className="inline-flex items-center rounded-md bg-green-900/50 px-2 py-1 text-xs font-medium text-green-100">
                {codebase.status}
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDate(codebase.createdAt)}
              </div>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
              <a
                href={codebase.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-zinc-800 p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                title="View on GitHub"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

