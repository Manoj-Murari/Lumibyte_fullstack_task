import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidePanel from '../components/SidePanel.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
        className={`absolute z-20 md:static ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out h-full ${isPanelOpen ? 'w-64 lg:w-72' : 'w-0'} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}
      >
        {isPanelOpen && <SidePanel closePanel={() => setIsPanelOpen(false)} />}
      </div>

      {/* Desktop Collapse/Expand Button */}
      {isPanelOpen ? (
        <button
          onClick={() => setIsPanelOpen(false)}
          className="hidden md:flex absolute left-64 lg:left-72 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-r-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-l-0 border-gray-200 dark:border-gray-600 transition-all duration-300 shadow-sm"
          title="Collapse sidebar"
        >
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      ) : (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-r-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-l-0 border-gray-200 dark:border-gray-600 transition-all duration-300 shadow-sm"
          title="Expand sidebar"
        >
          <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      )}

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