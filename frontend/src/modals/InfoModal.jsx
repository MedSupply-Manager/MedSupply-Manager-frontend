import React from 'react';
import { X } from 'lucide-react';

const InfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">À propos</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <img 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.Po9eYgj5GxUti3J1vCDKlwHaHa%3Fpid%3DApi&f=1&ipt=7f9eb1dbfc60dc0c79ca5429fb10830ce5dfee539a8f8500cc5d336a0fc110ee&ipo=images" 
                alt="Logo"
                className="w-8 h-8 rounded object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">PharmaStock</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gestion de Stock Médical</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300">
                <strong>Développé par:</strong> 5 ingénieurs en génie logiciel
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-800 dark:text-green-300">
                <strong>Universitaire:</strong> Université de Boumerdès - Algérie
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-purple-800 dark:text-purple-300">
                <strong>Technologies:</strong> React.js, Tailwind CSS, Node.js
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;