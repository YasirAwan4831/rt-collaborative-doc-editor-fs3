import { useState, useEffect, useCallback, useRef } from 'react';
import { documentApi } from '../services/api/documentApi.js';
import { socketService } from '../services/socket/socketService.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';
import { canEdit } from '../constants/roles.js';
import { useDebounce } from './useDebounce.js';

export function useEditor(documentId) {
  const [document, setDocument] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [versions, setVersions] = useState([]);
  const isRemoteUpdate = useRef(false);
  const [localContent, setLocalContent] = useState('');
  const debouncedContent = useDebounce(localContent, 800);

  const loadDocument = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    try {
      const res = await documentApi.get(documentId);
      setDocument(res.data);
      setLocalContent(res.data.content || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  useEffect(() => {
    if (!documentId || !document) return;

    socketService.joinDocument(documentId);

    const onJoined = (payload) => {
      if (payload.document) setDocument((d) => ({ ...d, ...payload.document }));
      setCollaborators(payload.collaborators || []);
    };

    const onUpdated = ({ content, updatedBy }) => {
      if (!content) return;
      isRemoteUpdate.current = true;
      setLocalContent(content);
      setDocument((d) => (d ? { ...d, content } : d));
      setTimeout(() => { isRemoteUpdate.current = false; }, 50);
    };

    const onPresence = (list) => setCollaborators(list || []);
    const onTyping = ({ typingUsers: users }) => setTypingUsers(users || []);
    const onSaved = () => setSaveStatus('saved');

    socketService.on(SOCKET_EVENTS.DOC_JOINED, onJoined);
    socketService.on(SOCKET_EVENTS.DOC_UPDATED, onUpdated);
    socketService.on(SOCKET_EVENTS.PRESENCE_SYNC, onPresence);
    socketService.on(SOCKET_EVENTS.TYPING_SYNC, onTyping);
    socketService.on(SOCKET_EVENTS.DOC_SAVED, onSaved);
    socketService.on(SOCKET_EVENTS.USER_ONLINE, () => {});
    socketService.on(SOCKET_EVENTS.USER_OFFLINE, () => {});

    return () => {
      socketService.leaveDocument(documentId);
      socketService.off(SOCKET_EVENTS.DOC_JOINED, onJoined);
      socketService.off(SOCKET_EVENTS.DOC_UPDATED, onUpdated);
      socketService.off(SOCKET_EVENTS.PRESENCE_SYNC, onPresence);
      socketService.off(SOCKET_EVENTS.TYPING_SYNC, onTyping);
      socketService.off(SOCKET_EVENTS.DOC_SAVED, onSaved);
    };
  }, [documentId, document?.id]);

  useEffect(() => {
    if (!documentId || !document || isRemoteUpdate.current) return;
    if (!canEdit(document.role)) return;
    if (!debouncedContent || debouncedContent === document.content) return;

    setSaveStatus('saving');
    socketService.sendUpdate(documentId, debouncedContent, document.title);
    socketService.saveDocument(documentId, debouncedContent);
  }, [debouncedContent, documentId, document?.content, document?.title, document?.role]);

  const updateContent = (html) => {
    if (!canEdit(document?.role)) return;
    setLocalContent(html);
    setDocument((d) => (d ? { ...d, content: html } : d));
    setSaveStatus('unsaved');
    socketService.startTyping(documentId);
  };

  const handleBlur = () => {
    socketService.stopTyping(documentId);
  };

  const loadVersions = async () => {
    const res = await documentApi.getVersions(documentId);
    setVersions(res.data || []);
  };

  const restoreVersion = async (versionId) => {
    const res = await documentApi.restoreVersion(documentId, versionId);
    setDocument(res.data);
    setLocalContent(res.data.content || '');
    await loadVersions();
  };

  return {
    document,
    collaborators,
    typingUsers,
    saveStatus,
    loading,
    error,
    versions,
    isRemoteUpdate,
    updateContent,
    handleBlur,
    loadVersions,
    restoreVersion,
    setSaveStatus,
  };
}

export default useEditor;
