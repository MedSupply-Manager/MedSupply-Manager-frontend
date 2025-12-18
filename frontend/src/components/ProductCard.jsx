import React from 'react';
import { Shield, Eye, Edit2, Trash2 } from 'lucide-react';

const ProductCard = ({ product, isSensible, onEdit, onDelete, onView }) => {
  const isLowStock = product.quantite <= product.seuil_alerte;
  const isCriticalStock = product.quantite <= (product.seuil_alerte / 2);
  
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 transition-all hover:shadow-lg hover:border-gray-600 hover:transform hover:-translate-y-1 duration-300">
      {/* En-tête avec nom et badge sensible */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">
            {product.nom}
          </h3>
          {product.description && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {product.description}
            </p>
          )}
        </div>
        {isSensible && (
          <div className="flex-shrink-0 ml-2">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-900/30 border border-purple-700 rounded-full">
              <Shield className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">Sensible</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Informations du produit */}
      <div className="space-y-2.5 text-xs mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Catégorie</span>
          <span className="font-medium text-gray-300">{product.categorie}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Prix</span>
          <span className="font-medium text-green-400">{product.prix}€</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Stock</span>
            <span className={`font-medium ${
              isCriticalStock ? 'text-red-400' :
              isLowStock ? 'text-orange-400' : 'text-gray-300'
            }`}>
              {product.quantite} unités
            </span>
          </div>
          {/* Barre de progression du stock */}
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isCriticalStock ? 'bg-red-500' :
                isLowStock ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ 
                width: `${Math.min(100, (product.quantite / (product.seuil_alerte * 2)) * 100)}%` 
              }}
            ></div>
          </div>
          <div className="text-[10px] text-gray-500 flex justify-between">
            <span>0</span>
            <span>Seuil: {product.seuil_alerte}</span>
            <span>{product.seuil_alerte * 2}</span>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-1.5">
        <button
          onClick={onView}
          className="flex-1 px-2.5 py-1.5 bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 hover:text-blue-200 rounded-lg font-medium text-xs flex items-center justify-center gap-1 transition-all duration-200 border border-blue-800/30 hover:border-blue-700/50"
        >
          <Eye className="w-3 h-3" />
          Voir
        </button>
        <button
          onClick={onEdit}
          className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs flex items-center justify-center transition-all duration-200 border border-gray-600 hover:border-gray-500"
          title="Modifier"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="px-2.5 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-300 hover:text-red-200 rounded-lg text-xs flex items-center justify-center transition-all duration-200 border border-red-800/30 hover:border-red-700/50"
          title="Supprimer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Badge stock faible/critique */}
      {isLowStock && (
        <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
          isCriticalStock 
            ? 'bg-red-900 text-red-100 border border-red-700' 
            : 'bg-orange-900 text-orange-100 border border-orange-700'
        }`}>
          {isCriticalStock ? 'CRITIQUE' : 'FAIBLE'}
        </div>
      )}
    </div>
  );
};

export default ProductCard;