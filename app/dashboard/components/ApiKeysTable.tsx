import type { ApiKey } from '../lib/types';
import { maskKey, formatDate } from '../lib/utils';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onDeleteClick: (apiKey: ApiKey) => void;
}

export function ApiKeysTable({ apiKeys, onDeleteClick }: ApiKeysTableProps) {
  if (apiKeys.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-zinc-400 font-mono">
          No API keys yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
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
                onClick={() => onDeleteClick(apiKey)}
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
  );
}

