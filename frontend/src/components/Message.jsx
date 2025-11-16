import { useState, useEffect } from 'react';
import { User, Cpu, ThumbsUp, ThumbsDown } from 'lucide-react';
import TableView from './TableView.jsx';

export default function Message({ message, messageIndex, sessionId }) {
  const isUser = message.type === 'user';
  const [feedback, setFeedback] = useState(null); // 'like', 'dislike', or null

  // Load feedback from localStorage on mount
  useEffect(() => {
    if (!isUser && sessionId && messageIndex !== undefined) {
      const key = `feedback_${sessionId}_${messageIndex}`;
      const saved = localStorage.getItem(key);
      if (saved === 'like' || saved === 'dislike') {
        setFeedback(saved);
      }
    }
  }, [isUser, sessionId, messageIndex]);

  // Handle feedback toggle
  const handleFeedback = (type) => {
    if (isUser || !sessionId || messageIndex === undefined) return;
    
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    
    // Save to localStorage
    const key = `feedback_${sessionId}_${messageIndex}`;
    if (newFeedback) {
      localStorage.setItem(key, newFeedback);
    } else {
      localStorage.removeItem(key);
    }
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white">
          <Cpu size={18} />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`p-3 rounded-lg max-w-lg lg:max-w-2xl ${isUser ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        ) : (
          <>
            {/* Table first (if exists) */}
            {message.table && (
              <div className="mb-3">
                <TableView tableData={message.table} />
              </div>
            )}
            
            {/* Description */}
            {message.text && (
              <p className="text-sm whitespace-pre-wrap mb-3">{message.text}</p>
            )}

            {/* Meta information (if exists) */}
            {message.meta && Object.keys(message.meta).length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 space-y-1">
                {Object.entries(message.meta).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-semibold">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            )}

            {/* Feedback buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleFeedback('like')}
                className={`p-1.5 rounded-md transition-colors ${
                  feedback === 'like'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
                title="Like this response"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                onClick={() => handleFeedback('dislike')}
                className={`p-1.5 rounded-md transition-colors ${
                  feedback === 'dislike'
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
                title="Dislike this response"
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* User Avatar on right side */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
