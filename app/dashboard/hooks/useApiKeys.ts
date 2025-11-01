import { useState, useEffect } from 'react';
import { fetchApiKeys, generateApiKey, deleteApiKey as deleteApiKeyApi } from '../lib/api';
import type { ApiKey } from '../lib/types';

export function useApiKeys(userId: string | undefined) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApiKeys = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchApiKeys(userId);
      setApiKeys(data || []);
    } catch (error) {
      console.error("Failed to load API keys", error);
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadApiKeys();
    }
  }, [userId]);

  const createApiKey = async (name: string) => {
    if (!userId) throw new Error("User ID required");
    const result = await generateApiKey(userId, name);
    await loadApiKeys();
    return result.api_key;
  };

  const deleteApiKey = async (key: string) => {
    await deleteApiKeyApi(key);
    await loadApiKeys();
  };

  return {
    apiKeys,
    loading,
    loadApiKeys,
    createApiKey,
    deleteApiKey,
  };
}

