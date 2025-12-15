import React from 'react';
import { X, History } from 'lucide-react';

const HistoryModal = ({ historique, onClose, darkMode }) => {
  const actionColors = {
    AJOUT: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    MODIFICATION: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    SUPPRESSION: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
    ACTIVATION: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
    DESACTIVATION: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5" />
            Historique des Actions
          </h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {historique.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400">Aucune action enregistrée.</p>
          ) : (
            <div className="space-y-4">
              {historique.map(entry => (
                <div key={entry.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${actionColors[entry.action] || 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                      {entry.action}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {entry.utilisateur ? <strong>{entry.utilisateur}</strong> : 'Système'} a {entry.action.toLowerCase()} 
                    {entry.produit_nom ? ` le produit "${entry.produit_nom}" (${entry.type_produit})` : ' un élément'}.
                  </p>
                  {entry.details && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{entry.details}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;