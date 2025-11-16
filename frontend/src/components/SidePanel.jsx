import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { PlusSquare, MessageSquare, Trash2, X } from 'lucide-react';

export default function SidePanel({ closePanel }) {
  const { sessions, startNewSession, currentSessionId } = useSession();
  const navigate = useNavigate();

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
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Chat History
        </h3>
        {sessions.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
            No chat history yet. Start a new chat to begin!
          </p>
        ) : (
          sessions.map((session) => (
            <button
              key={session.sessionId}
              onClick={() => handleSelectChat(session.sessionId)}
              className={`w-full flex items-center justify-between gap-2 p-2 rounded-md text-left text-sm ${session.sessionId === currentSessionId ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={16} />
                <span className="truncate">{session.title}</span>
              </div>
              {/* Optional: Add a delete button later */}
              {/* <Trash2 size={14} className="opacity-50 hover:opacity-100" /> */}
            </button>
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
            {/* Based on your user summary, I know your name */}
            <span className="font-semibold text-sm">Manoj Murari</span>
            <span className="text-xs text-gray-500">B.Tech Graduate</span>
          </div>
        </div>
      </div>
    </div>
  );
}