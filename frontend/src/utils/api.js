import { API_URL } from './constants';

export const fetchProducts = async () => {
  const [normalRes, sensibleRes] = await Promise.all([
    fetch(`${API_URL}/produits`),
    fetch(`${API_URL}/produits-sensibles`)
  ]);
  const normalData = await normalRes.json();
  const sensibleData = await sensibleRes.json();
  
  return {
    normaux: normalData,
    sensibles: sensibleData
  };
};

export const deleteProduct = async (id, isSensible) => {
  const endpoint = isSensible ? 'produits-sensibles' : 'produits';
  const response = await fetch(`${API_URL}/${endpoint}/${id}`, { 
    method: 'DELETE' 
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression');
  }
};

export const saveProduct = async (formData) => {
  const isSensible = formData.isSensible;
  const endpoint = isSensible ? 'produits-sensibles' : 'produits';
  const method = formData.id ? 'PUT' : 'POST';
  const url = formData.id ? `${API_URL}/${endpoint}/${formData.id}` : `${API_URL}/${endpoint}`;
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la sauvegarde');
  }
  
  return await response.json();
};