// TopBar component - extracted from ChatLayout for spec compliance
import ThemeToggle from './ThemeToggle.jsx';

export default function TopBar({ onMenuToggle, isPanelOpen }) {
  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Mobile Menu Toggle Button */}
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isPanelOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      )}
      
      <div className="flex-1"></div>
      
      {/* Theme Toggle */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </div>
  );
}

