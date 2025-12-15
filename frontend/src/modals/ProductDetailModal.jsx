import React from 'react';
import { X, Shield } from 'lucide-react';

const ProductDetailModal = ({ product, isSensible, onClose, onEdit }) => {
  const isLowStock = product.quantite <= product.seuil_alerte;
  const isCriticalStock = product.quantite <= (product.seuil_alerte / 2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {isSensible && <Shield className="w-5 h-5 text-purple-500" />}
            Détails du Produit
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'}
                alt={product.nom}
                className="w-48 h-48 rounded-lg object-cover shadow-sm"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.nom}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Prix:</span>
                  <p className="font-semibold text-green-600 dark:text-green-400 text-lg">{product.prix}€</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Stock:</span>
                  <p className={`font-semibold text-lg ${
                    isCriticalStock ? 'text-red-600 dark:text-red-400' :
                    isLowStock ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {product.quantite} unités
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Seuil d'alerte:</span>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">{product.seuil_alerte} unités</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Catégorie:</span>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">{product.categorie}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Informations Générales
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Sous-catégorie:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{product.sous_categorie || 'Non spécifiée'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Classe thérapeutique:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{product.classe_therapeutique || 'Non spécifiée'}</span>
                </div>
              </div>
            </div>

            {isSensible && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Informations Sensibles
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Fabricant:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{product.nom_fabricant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Numéro de lot:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{product.lot || 'Non spécifié'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Niveau de danger:</span>
                    <span className={`font-medium ${
                      product.niveau_danger === 'Élevé' ? 'text-red-600 dark:text-red-400' :
                      product.niveau_danger === 'Moyen' ? 'text-orange-600 dark:text-orange-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {product.niveau_danger}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isSensible && product.restrictions_legales && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Restrictions Légales</h4>
              <p className="text-sm text-orange-700 dark:text-orange-400">{product.restrictions_legales}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Niveau de stock:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {product.quantite} / {product.seuil_alerte * 2} unités
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  isCriticalStock ? 'bg-red-500' :
                  isLowStock ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (product.quantite / (product.seuil_alerte * 2)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;