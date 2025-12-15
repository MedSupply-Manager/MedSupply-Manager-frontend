import React from 'react';
import { Shield, Eye, Edit2, Trash2 } from 'lucide-react';

const ProductCard = ({ product, isSensible, onEdit, onDelete, onView }) => {
  const isLowStock = product.quantite <= product.seuil_alerte;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex-1 leading-tight">
          {product.nom}
        </h3>
        {isSensible && (
          <Shield className="w-4 h-4 text-purple-500 flex-shrink-0 ml-2" />
        )}
      </div>
      
      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
        <div className="flex justify-between">
          <span>Catégorie:</span>
          <span className="font-medium">{product.categorie}</span>
        </div>
        <div className="flex justify-between">
          <span>Prix:</span>
          <span className="font-medium text-green-600 dark:text-green-400">{product.prix}€</span>
        </div>
        <div className="flex justify-between">
          <span>Stock:</span>
          <span className={`font-medium ${
            isLowStock ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {product.quantite} unités
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md font-medium text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <Eye className="w-3 h-3" />
          Voir
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-xs flex items-center justify-center transition-colors"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md text-xs flex items-center justify-center transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;