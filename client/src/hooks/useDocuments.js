import { useState, useCallback, useEffect } from 'react';
import { documentApi } from '../services/api/documentApi.js';
import { useDebounce } from './useDebounce.js';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const fetchDocuments = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await documentApi.list({ search: query });
      setDocuments(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments(debouncedSearch);
  }, [debouncedSearch, fetchDocuments]);

  const createDocument = async (title) => {
    const res = await documentApi.create({ title });
    setDocuments((prev) => [res.data, ...prev]);
    return res.data;
  };

  const renameDocument = async (id, title) => {
    const res = await documentApi.rename(id, title);
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...res.data } : d)));
    return res.data;
  };

  const deleteDocument = async (id) => {
    await documentApi.delete(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    documents,
    loading,
    error,
    search,
    setSearch,
    createDocument,
    renameDocument,
    deleteDocument,
    refresh: () => fetchDocuments(debouncedSearch),
  };
}

export default useDocuments;
