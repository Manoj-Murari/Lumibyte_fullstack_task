import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatLayout from './pages/ChatLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { useSession } from './context/SessionContext.jsx';
import ChatInterface from './components/ChatInterface.jsx';

// This wrapper component will handle loading the session from the URL
const ChatInterfaceWrapper = () => {
  const { sessionId } = useParams();
  const { selectSession, currentSessionId } = useSession();

  // This effect runs when the URL parameter (sessionId) changes
  useEffect(() => {
    // Only reload if the URL param is different from the one in context
    if (sessionId && sessionId !== currentSessionId) {
      console.log('URL param changed, loading session:', sessionId);
      selectSession(sessionId);
    }
  }, [sessionId, selectSession, currentSessionId]);
  
  // Render the main chat interface
  return <ChatInterface />;
};

function App() {
  return (
    // This is the main app container. We set the base colors here.
    <div className="w-full h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <Routes>
        {/* The landing page is shown when no session is selected */}
        <Route path="/" element={<ChatLayout />}>
          <Route index element={<LandingPage />} />
          {/* The chat interface is shown when a session ID is in the URL */}
          <Route path="chat/:sessionId" element={<ChatInterfaceWrapper />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;