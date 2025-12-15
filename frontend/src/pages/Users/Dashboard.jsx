import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Add these imports
import ControlsBar from '../../components/ControlsBar';
import ProductCard from '../../components/ProductCard';
import ProductTable from '../../components/ProductTable';
import Loader from '../../components/Loader';
import { Package, Truck, BarChart3, Menu, X, LogOut, ChevronRight, Home, AlertTriangle } from 'lucide-react';
import { fetchProducts, deleteProduct } from '../../utils/api';

const Dashboard = ({ 
  activeTab, 
  setActiveTab, 
  setShowForm, 
  setEditingProduct, 
  setShowHistory,
  setSelectedProduct,
  onEditProduct,
  onLogout,
  user
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [produits, setProduits] = useState([]);
  const [produitsSensibles, setProduitsSensibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({ 
    normaux: 0, 
    sensibles: 0, 
    alertes: 0,
    totalValeur: 0
  });

  // Add useNavigate and useLocation hooks
  const navigate = useNavigate();
  const location = useLocation();
  const activeMenu = location.pathname; // This will auto-detect active route
  
  // Menu items with correct paths (remove http://localhost:5173)
  const menuItems = [
    { path: '/', icon: Home, label: 'Accueil' }, // Changed from http://localhost:5173/dashboard
    { path: '/products', icon: Package, label: 'Produits' },
    { path: '/suppliers', icon: Truck, label: 'Fournisseurs' },
    // Add other routes you want to navigate to
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProduits(data.normaux);
      setProduitsSensibles(data.sensibles);
      
      const alertesCount = [...data.normaux, ...data.sensibles].filter(
        p => p.quantite <= p.seuil_alerte
      ).length;
      
      const totalValeur = [...data.normaux, ...data.sensibles].reduce(
        (sum, p) => sum + (p.prix * p.quantite), 0
      );
      
      setStats({
        normaux: data.normaux.length,
        sensibles: data.sensibles.length,
        alertes: alertesCount,
        totalValeur: totalValeur
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id, isSensible) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      await deleteProduct(id, isSensible);
      fetchData();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // FIXED: Use navigate instead of window.location.href
  const handleNavigation = (path) => {
    navigate(path);
  };

  const categories = activeTab === 'normaux' 
    ? ['Médicament Général', 'Antibiotiques', 'Analgésiques', 'Cardiovasculaire', 'Digestif', 'Protection', 'Consommable']
    : ['Morphiniques', 'Traitement Psychique', 'Antidépresseurs'];

  const filteredProducts = (activeTab === 'normaux' ? produits : produitsSensibles)
    .filter(p => 
      (filterCategory === 'all' || p.categorie === filterCategory) &&
      (p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar simplifiée */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">PS</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">PharmaStock</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Gestion de Stock</p>
              </div>
            </div>
          </div>

          {/* Navigation principale */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                Navigation
              </h3>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'admin@pharmastock.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {activeTab === 'normaux' ? 'Médicaments Normaux' : 'Produits Sensibles'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gestion et surveillance des stocks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Bouton Alertes */}
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {stats.alertes > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {stats.alertes}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Rest of your code remains the same */}
        <main className="p-6">
          <div className="space-y-6">
            {/* Stats Cards avec design amélioré */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ... rest of your stats cards ... */}
            </div>

            {/* Controls Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <ControlsBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setFilterCategory={setFilterCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                setShowForm={setShowForm}
                setEditingProduct={setEditingProduct}
                setShowHistory={setShowHistory}
                categories={categories}
              />
            </div>

            {/* Contenu principal */}
            {loading ? (
              <Loader />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSensible={activeTab === 'sensibles'}
                    onEdit={() => onEditProduct(product, activeTab === 'sensibles')}
                    onDelete={() => handleDelete(product.id, activeTab === 'sensibles')}
                    onView={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <ProductTable
                  products={filteredProducts}
                  isSensible={activeTab === 'sensibles'}
                  onEdit={onEditProduct}
                  onDelete={handleDelete}
                  onView={setSelectedProduct}
                />
              </div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <EmptyState />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-100 dark:border-gray-700">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
      <Package className="w-10 h-10 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
      Aucun produit trouvé
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou ajoutez de nouveaux produits.
    </p>
    <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all duration-200">
      Ajouter un produit
    </button>
  </div>
);

export default Dashboard;