export interface ApiKey {
  key: string;
  name: string;
  createdAt: string;
  usage?: number;
}

export interface GitHubRepository {
  githubId: number;
  fullName: string;
  name: string;
  private: boolean;
  description: string | null;
  defaultBranch: string;
  url: string;
  isIndexed: boolean;
}

export interface IndexedCodebase {
  id: string;
  fullName: string;
  githubUrl: string;
  defaultBranch: string;
  isPrivate: boolean;
  description: string | null;
  status: string;
  createdAt: string;
}

export type ActiveSection = 'codebases' | 'api-keys';

