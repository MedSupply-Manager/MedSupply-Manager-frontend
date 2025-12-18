import React from 'react';
import { Search, History, Grid, List, Plus, Filter } from 'lucide-react';

const ControlsBar = ({ 
  activeTab, 
  setActiveTab, 
  setFilterCategory, 
  searchTerm, 
  setSearchTerm,
  viewMode,
  setViewMode,
  setShowForm,
  setEditingProduct,
  setShowHistory,
  categories
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg border border-gray-700">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Section gauche : Onglets */}
        <div className="flex gap-1 bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab('normaux'); setFilterCategory('all'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'normaux'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            Normaux
          </button>
          <button
            onClick={() => { setActiveTab('sensibles'); setFilterCategory('all'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'sensibles'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            Sensibles
          </button>
        </div>

        {/* Section centrale : Recherche et Filtres */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtre par catégorie */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Filter className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <select
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-8 pr-6 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all" className="bg-gray-800">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none">
              <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section droite : Actions */}
        <div className="flex gap-2">
          {/* Bouton Historique */}
          <button
            onClick={() => { setShowHistory(true); }}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 border border-gray-600 hover:border-gray-500"
            title="Voir l'historique"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Historique</span>
          </button>

          {/* Boutons de vue */}
          <div className="flex bg-gray-700 p-0.5 rounded-lg border border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
              title="Vue grille"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
              title="Vue tableau"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bouton Ajouter */}
          <button
            onClick={() => { setEditingProduct({ isSensible: activeTab === 'sensibles' }); setShowForm(true); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === 'sensibles'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Info sur le nombre de résultats */}
      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {activeTab === 'normaux' ? 'Produits normaux' : 'Produits sensibles'}
        </div>
        <div className="text-xs text-gray-400">
          Vue: {viewMode === 'grid' ? 'Grille' : 'Tableau'}
        </div>
      </div>
    </div>
  );
};

export default ControlsBar;