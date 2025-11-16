import { createContext, useContext, useState, useEffect } from 'react';
import { getSessions, getHistory, createSession, updateSession, deleteSession } from '../lib/api.js';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]); // List for side panel
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]); // Messages for the active chat
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all sessions on initial app load
  useEffect(() => {
    const loadAllSessions = async () => {
      try {
        const sessionsList = await getSessions();
        // Transform backend format (id) to frontend format (sessionId)
        const transformed = sessionsList.map(s => ({
          sessionId: s.id,
          title: s.title,
          createdAt: s.createdAt
        }));
        setSessions(transformed);
      } catch (err) {
        console.error('Failed to load sessions:', err);
        setError('Failed to load sessions.');
      }
    };
    loadAllSessions();
  }, []);

  // Function to select a session (from side panel)
  const selectSession = async (sessionId) => {
    if (!sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
      return;
    }
    
    setIsLoading(true);
    setCurrentSessionId(sessionId);
    try {
      const history = await getHistory(sessionId);
      // Transform backend format to frontend format
      const transformed = history.map(msg => {
        if (msg.role === 'user') {
          return { type: 'user', text: msg.text };
        } else {
          return {
            type: 'ai',
            text: msg.description || '',
            table: msg.answer ? {
              headers: msg.answer.columns,
              rows: msg.answer.rows
            } : null,
            responseId: msg.responseId,
            meta: msg.meta
          };
        }
      });
      setMessages(transformed);
      setError(null);
    } catch (err) {
      console.error('Failed to load session history:', err);
      setError('Failed to load chat history.');
      setMessages([]);
    }
    setIsLoading(false);
  };

  // Function to start a brand new chat
  const startNewSession = async () => {
    setIsLoading(true);
    try {
      const result = await createSession();
      const newSessionId = result.sessionId;
      
      // Reload sessions list
      const sessionsList = await getSessions();
      const transformed = sessionsList.map(s => ({
        sessionId: s.id,
        title: s.title,
        createdAt: s.createdAt
      }));
      setSessions(transformed);
      
      setCurrentSessionId(newSessionId);
      setMessages([]); // Start with no messages
      setError(null);
      
      return newSessionId; // Return new ID for navigation
    } catch (err) {
      console.error('Failed to create new session:', err);
      setError('Failed to start a new chat.');
    }
    setIsLoading(false);
  };

  // Function to update session title
  const updateSessionTitle = async (sessionId, newTitle) => {
    try {
      await updateSession(sessionId, newTitle);
      
      // Reload sessions list
      const sessionsList = await getSessions();
      const transformed = sessionsList.map(s => ({
        sessionId: s.id,
        title: s.title,
        createdAt: s.createdAt
      }));
      setSessions(transformed);
      
      return true;
    } catch (err) {
      console.error('Failed to update session title:', err);
      setError('Failed to update session title.');
      return false;
    }
  };

  // Function to delete a session
  const removeSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      
      // If deleted session is current, navigate to landing
      if (sessionId === currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      
      // Reload sessions list
      const sessionsList = await getSessions();
      const transformed = sessionsList.map(s => ({
        sessionId: s.id,
        title: s.title,
        createdAt: s.createdAt
      }));
      setSessions(transformed);
      
      return true;
    } catch (err) {
      console.error('Failed to delete session:', err);
      setError('Failed to delete session.');
      return false;
    }
  };
  
  // Value to pass to consumers
  const value = {
    sessions,
    setSessions,
    currentSessionId,
    selectSession,
    startNewSession,
    updateSessionTitle,
    removeSession,
    messages,
    setMessages,
    isLoading,
    error,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook for easy access
export const useSession = () => useContext(SessionContext);