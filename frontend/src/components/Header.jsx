import React from 'react';
import { Moon, Sun, Info, Home } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, setShowInfo }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5173/dashboard"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              title="Aller au tableau de bord"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
            </a>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <img 
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.Po9eYgj5GxUti3J1vCDKlwHaHa%3Fpid%3DApi&f=1&ipt=7f9eb1dbfc60dc0c79ca5429fb10830ce5dfee539a8f8500cc5d336a0fc110ee&ipo=images" 
                  alt="Logo PharmaStock"
                  className="w-8 h-8 rounded object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowInfo(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;