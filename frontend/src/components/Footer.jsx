import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 py-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <img 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.Po9eYgj5GxUti3J1vCDKlwHaHa%3Fpid%3DApi&f=1&ipt=7f9eb1dbfc60dc0c79ca5429fb10830ce5dfee539a8f8500cc5d336a0fc110ee&ipo=images" 
                alt="Logo"
                className="w-4 h-4 rounded object-cover"
              />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">PharmaStock</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Développé par 5 ingénieurs - Université de Boumerdès
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              © 2025 PharmaStock - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;