import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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
      toast.error("Failed to load API keys. Please try again.");
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
    try {
      const result = await generateApiKey(userId, name);
      await loadApiKeys();
      toast.success(`API key "${name}" created successfully!`);
      return result.api_key;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create API key. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteApiKey = async (key: string) => {
    try {
      await deleteApiKeyApi(key);
      await loadApiKeys();
      toast.success("API key deleted successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete API key. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    apiKeys,
    loading,
    loadApiKeys,
    createApiKey,
    deleteApiKey,
  };
}

