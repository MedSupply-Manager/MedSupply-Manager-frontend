import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';

const ProductFormModal = ({ product, onClose, activeTab }) => {
  const [formData, setFormData] = useState({
    id: product?.id || null,
    nom: product?.nom || '',
    description: product?.description || '',
    prix: product?.prix || '',
    categorie: product?.categorie || (activeTab === 'sensibles' ? 'Morphiniques' : 'Médicament Général'),
    sous_categorie: product?.sous_categorie || '',
    quantite: product?.quantite || 0,
    seuil_alerte: product?.seuil_alerte || (activeTab === 'sensibles' ? 5 : 10),
    image_url: product?.image_url || '',
    necessite_ordonnance: product?.necessite_ordonnance || false,
    classe_therapeutique: product?.classe_therapeutique || '',
    isSensible: product?.isSensible || (activeTab === 'sensibles'),
    nom_fabricant: product?.nom_fabricant || '', // ← NOUVEAU CHAMP POUR TOUS
    lot: product?.lot || '',
    niveau_danger: product?.niveau_danger || 'Élevé',
    restrictions_legales: product?.restrictions_legales || ''
  });

  const categoriesNormaux = ['Médicament Général', 'Antibiotiques', 'Analgésiques', 'Cardiovasculaire', 'Digestif', 'Protection', 'Consommable'];
  const categoriesSensibles = ['Morphiniques', 'Traitement Psychique', 'Antidépresseurs'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.nom || !formData.prix || !formData.categorie || !formData.nom_fabricant) {
      alert('Nom, prix, catégorie et nom du fabricant sont obligatoires');
      return;
    }

    try {
      const isSensible = formData.isSensible;
      const endpoint = isSensible ? 'produits-sensibles' : 'produits';
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id 
                ? `http://localhost:3001/api/${endpoint}/${formData.id}` 
                : `http://localhost:3001/api/${endpoint}`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }
      
      onClose();
      window.location.reload(); // Recharge pour mettre à jour les données
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du produit: ' + error.message);
    }
  };

  const categories = formData.isSensible ? categoriesSensibles : categoriesNormaux;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
          formData.isSensible ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
        }`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {formData.isSensible && <Shield className="w-5 h-5 text-purple-500" />}
            {formData.id ? 'Modifier' : 'Ajouter'} un produit {formData.isSensible ? 'sensible' : ''}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nom du produit *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nom du produit"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL de l'image</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://exemple.com/image.jpg"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lien vers la photo du médicament
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Catégorie *</label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* CHAMP NOM FABRICANT - OBLIGATOIRE POUR TOUS */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fabricant *</label>
              <input
                type="text"
                name="nom_fabricant"
                value={formData.nom_fabricant}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nom du fabricant"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantité</label>
              <input
                type="number"
                name="quantite"
                value={formData.quantite}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Seuil d'alerte</label>
              <input
                type="number"
                name="seuil_alerte"
                value={formData.seuil_alerte}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* Champs spécifiques aux produits sensibles */}
            {formData.isSensible && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Numéro de lot</label>
                  <input
                    type="text"
                    name="lot"
                    value={formData.lot}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Numéro de lot"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Niveau de danger</label>
                  <select
                    name="niveau_danger"
                    value={formData.niveau_danger}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Élevé">Élevé</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Faible">Faible</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Restrictions légales</label>
                  <textarea
                    name="restrictions_legales"
                    value={formData.restrictions_legales}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Produit soumis à prescription médicale obligatoire"
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                formData.isSensible
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {formData.id ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;