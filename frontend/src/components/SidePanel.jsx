import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { PlusSquare, MessageSquare, Trash2, X, Edit2, Check } from 'lucide-react';

export default function SidePanel({ closePanel }) {
  const { sessions, startNewSession, currentSessionId, updateSessionTitle, removeSession } = useSession();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  const handleNewChat = async () => {
    const newSessionId = await startNewSession();
    if (newSessionId) {
      navigate(`/chat/${newSessionId}`);
    }
    // Close panel on mobile after starting a new chat
    if (window.innerWidth < 768) {
      closePanel();
    }
  };
  
  const handleSelectChat = (sessionId) => {
    navigate(`/chat/${sessionId}`);
    // Close panel on mobile after selecting a chat
    if (window.innerWidth < 768) {
      closePanel();
    }
  };

  const handleEditClick = (e, session) => {
    e.stopPropagation();
    setEditingId(session.sessionId);
    setEditValue(session.title);
  };

  const handleSaveEdit = async (e, sessionId) => {
    e.stopPropagation();
    if (editValue.trim()) {
      await updateSessionTitle(sessionId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditValue('');
  };

  const handleDeleteClick = async (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      const success = await removeSession(sessionId);
      if (success) {
        // If we deleted the current session, navigate to landing
        if (sessionId === currentSessionId) {
          navigate('/');
        }
      } else {
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-3">
      {/* Header: New Chat + Close Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleNewChat}
          className="flex-1 flex items-center gap-2 p-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
        >
          <PlusSquare size={16} />
          New Chat
        </button>
        <button
          onClick={closePanel}
          className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ml-2"
        >
          <X size={20} />
        </button>
      </div>

      {/* Session History List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Chat History
        </h3>
        {sessions.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
            No chat history yet. Start a new chat to begin!
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.sessionId}
              className={`group relative flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors ${
                session.sessionId === currentSessionId
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => setHoveredId(session.sessionId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {editingId === session.sessionId ? (
                // Edit mode
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(e, session.sessionId);
                      } else if (e.key === 'Escape') {
                        handleCancelEdit(e);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-2 py-1 text-sm rounded border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={(e) => handleSaveEdit(e, session.sessionId)}
                    className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400"
                    title="Save"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                    title="Cancel"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                // View mode
                <>
                  <button
                    onClick={() => handleSelectChat(session.sessionId)}
                    className="flex items-center gap-2 truncate flex-1 min-w-0 text-left"
                  >
                    <MessageSquare size={16} className="flex-shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </button>
                  
                  {/* Action buttons - show on hover or when active */}
                  {(hoveredId === session.sessionId || session.sessionId === currentSessionId) && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => handleEditClick(e, session)}
                        className="p-1.5 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 opacity-70 hover:opacity-100 transition-opacity"
                        title="Edit title"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, session.sessionId)}
                        className="p-1.5 rounded hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-400 opacity-70 hover:opacity-100 transition-opacity"
                        title="Delete session"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer: User Info */}
      <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Manoj Murari</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">B.Tech Graduate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
