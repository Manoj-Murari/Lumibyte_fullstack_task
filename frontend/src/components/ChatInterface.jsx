import { useState, useEffect, useRef } from 'react';
import { useSession } from '../context/SessionContext.jsx';
import { ask } from '../lib/api.js';
import Message from './Message.jsx';
import { Send, Loader2 } from 'lucide-react';

export default function ChatInterface() {
  const { currentSessionId, messages, setMessages, isLoading, error } = useSession();
  const [input, setInput] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentSessionId || isAiResponding) return;

    const userMessage = { type: 'user', text: input };
    setMessages([...messages, userMessage]); // Show user message immediately
    setInput('');
    setIsAiResponding(true);

    try {
      // Send question to backend - new format
      const answer = await ask(currentSessionId, input);
      // Transform backend response to frontend format
      const aiMessage = {
        type: 'ai',
        text: answer.description || '',
        table: answer.answerTable ? {
          headers: answer.answerTable.columns,
          rows: answer.answerTable.rows
        } : null,
        responseId: answer.answerTable?.id,
        meta: answer.meta
      };
      setMessages((prev) => [...prev, aiMessage]); // Add AI response
    } catch (err) {
      console.error('Failed to post question:', err);
      // Show an error message in the chat
      const errorMessage = {
        type: 'ai',
        text: 'Sorry, I ran into an error. Please try again.',
        table: null,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setIsAiResponding(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <Message 
            key={index} 
            message={msg} 
            messageIndex={index}
            sessionId={currentSessionId}
          />
        ))}
        {isAiResponding && (
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm text-gray-500">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isAiResponding || !input.trim()}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}