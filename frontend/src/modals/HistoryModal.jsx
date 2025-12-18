import React from 'react';
import { X, History, Clock, User } from 'lucide-react';

const HistoryModal = ({ historique, onClose }) => {
  const actionConfigs = {
    AJOUT: {
      color: 'text-green-400',
      bg: 'bg-green-900/30',
      icon: '➕'
    },
    MODIFICATION: {
      color: 'text-blue-400',
      bg: 'bg-blue-900/30',
      icon: '✏️'
    },
    SUPPRESSION: {
      color: 'text-red-400',
      bg: 'bg-red-900/30',
      icon: '🗑️'
    },
    ACTIVATION: {
      color: 'text-purple-400',
      bg: 'bg-purple-900/30',
      icon: '✅'
    },
    DESACTIVATION: {
      color: 'text-orange-400',
      bg: 'bg-orange-900/30',
      icon: '⏸️'
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) {
      return `${diffMins} min`;
    } else if (diffHours < 24) {
      return `${diffHours} h`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[75vh] overflow-hidden border border-gray-700">
        {/* Header compact */}
        <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Historique</h2>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
              {historique.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
        </div>
        
        {/* Content compact */}
        <div className="p-4 overflow-y-auto max-h-[55vh]">
          {historique.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                <History className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm">Aucune action enregistrée</p>
            </div>
          ) : (
            <div className="space-y-2">
              {historique.map((entry, index) => {
                const config = actionConfigs[entry.action] || {
                  color: 'text-gray-400',
                  bg: 'bg-gray-700',
                  icon: '📝'
                };

                return (
                  <div 
                    key={entry.id || index}
                    className="bg-gray-700/40 rounded-lg p-3 hover:bg-gray-700/60 transition-colors border border-gray-600/50"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icône d'action */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                        <span className="text-sm">{config.icon}</span>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                              {entry.action}
                            </span>
                            {entry.type_produit && (
                              <span className="text-xs text-gray-400">
                                {entry.type_produit === 'sensibles' ? '⚡' : '📦'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatDate(entry.createdAt)}
                          </div>
                        </div>

                        {/* Description compacte */}
                        <div className="mb-1">
                          <p className="text-sm text-gray-300">
                            <span className="inline-flex items-center gap-1 mr-1">
                              <User className="w-3 h-3 text-gray-500" />
                              <span className="font-medium text-gray-200">{entry.utilisateur || 'Système'}</span>
                            </span>
                            <span>
                              {entry.produit_nom ? (
                                <>
                                  → <span className="text-white">{entry.produit_nom}</span>
                                </>
                              ) : (
                                'a effectué une action'
                              )}
                            </span>
                          </p>
                        </div>

                        {/* Détails réduits */}
                        {entry.details && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {entry.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer compact */}
        <div className="px-5 py-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;