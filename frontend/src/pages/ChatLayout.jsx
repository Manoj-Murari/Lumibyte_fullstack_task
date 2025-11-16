import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidePanel from '../components/SidePanel.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { Menu, X } from 'lucide-react';

export default function ChatLayout() {
  // Load panel state from localStorage
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    const saved = localStorage.getItem('panelOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save panel state to localStorage
  useEffect(() => {
    localStorage.setItem('panelOpen', JSON.stringify(isPanelOpen));
  }, [isPanelOpen]);

  return (
    <div className="flex h-screen w-full relative">
      {/* --- Side Panel --- */}
      <div
        className={`absolute z-20 md:static ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out h-full w-64 lg:w-72 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <SidePanel closePanel={() => setIsPanelOpen(false)} />
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-700">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isPanelOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
          
          <div className="flex-1"></div> 
          
          {/* Place the component here */}
          <div className="flex items-center gap-4">
             <ThemeToggle />
          </div>
        </div>

        {/* Chat Area (this is where the <Outlet /> renders) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}