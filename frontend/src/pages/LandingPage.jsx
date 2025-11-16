import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { Sparkles, PlusSquare } from 'lucide-react';

export default function LandingPage() {
  const { startNewSession } = useSession();
  const navigate = useNavigate();

  const handleNewChat = async () => {
    const newSessionId = await startNewSession();
    if (newSessionId) {
      navigate(`/chat/${newSessionId}`);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Sparkles size={48} className="text-blue-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Simplified ChatGPT</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Start a new chat to get answers, insights, and more.
      </p>
      <button
        onClick={handleNewChat}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        <PlusSquare size={20} />
        Start New Chat
      </button>
    </div>
  );
}