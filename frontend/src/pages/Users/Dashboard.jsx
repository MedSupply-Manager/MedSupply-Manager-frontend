import React, { useState, useEffect } from 'react';
import ControlsBar from '../../components/ControlsBar';
import ProductCard from '../../components/ProductCard';
import ProductTable from '../../components/ProductTable';
import Loader from '../../components/Loader';
import ProductFormModal from '../../modals/ProductFormModal';
import ProductDetailModal from '../../modals/ProductDetailModal';
import HistoryModal from '../../modals/HistoryModal';
import InfoModal from '../../modals/InfoModal';
import { Package, Truck, BarChart3, Menu, X, LogOut, ChevronRight, Home, AlertTriangle } from 'lucide-react';
import { fetchProducts, deleteProduct } from '../../utils/api';
import { API_URL } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
const Dashboard = ({ 
  onLogout,
  user
}) => {
  // Forcer le dark mode
  useEffect(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }, []);


  // États pour la sidebar et la navigation
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('/products');
  const { logout } = useAuth();
  // États pour les produits
  const [produits, setProduits] = useState([]);
  const [produitsSensibles, setProduitsSensibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('normaux');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({ 
    normaux: 0, 
    sensibles: 0, 
    alertes: 0,
    totalValeur: 0
  });

  // États pour les modals
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historique, setHistorique] = useState([]);

  // Menu items
  const menuItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Tableau de Bord' },
    { path: '/products', icon: Package, label: 'Gestion Produits' },
    { path: '/suppliers', icon: Truck, label: 'Commandes Fournisseurs' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchHistorique = async () => {
    try {
      const response = await fetch(`${API_URL}/historique`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de l\'historique');
      const data = await response.json();
      setHistorique(data);
    } catch (error) {
      console.error('Erreur fetchHistorique:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProduits(data.normaux || []);
      setProduitsSensibles(data.sensibles || []);
      
      const allProducts = [...(data.normaux || []), ...(data.sensibles || [])];
      const alertesCount = allProducts.filter(
        p => p.quantite <= p.seuil_alerte
      ).length;
      
      const totalValeur = allProducts.reduce(
        (sum, p) => sum + (p.prix * p.quantite), 0
      );
      
      setStats({
        normaux: data.normaux?.length || 0,
        sensibles: data.sensibles?.length || 0,
        alertes: alertesCount,
        totalValeur: totalValeur
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
      // Données de test
      setProduits([
        { id: 1, nom: 'Test Product', description: 'Test Description', prix: 10.5, categorie: 'Analgésiques', quantite: 25, seuil_alerte: 10, image_url: '' }
      ]);
      setStats({
        normaux: 1,
        sensibles: 0,
        alertes: 0,
        totalValeur: 262.5
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id, isSensible) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      await deleteProduct(id, isSensible);
      fetchData();
      alert('Produit supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleEditProduct = (product, isSensible) => {
    setEditingProduct({ ...product, isSensible });
    setShowForm(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleOpenHistory = async () => {
    setShowHistory(true);
    await fetchHistorique();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
};

  const handleNavigation = (path) => {
    if (path === '/products') {
      setActiveMenu(path);
    } else {
      window.location.href = path;
    }
  };

  const categories = activeTab === 'normaux' 
    ? ['Médicament Général', 'Antibiotiques', 'Analgésiques', 'Cardiovasculaire', 'Digestif', 'Protection', 'Consommable']
    : ['Morphiniques', 'Traitement Psychique', 'Antidépresseurs'];

  const filteredProducts = (activeTab === 'normaux' ? produits : produitsSensibles)
    .filter(p => 
      (filterCategory === 'all' || p.categorie === filterCategory) &&
      (p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );

  // Si on n'est pas sur la page des produits
  if (activeMenu !== '/products') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 w-64`}
        >
          <div className="h-full bg-gray-800 backdrop-blur-xl border-r border-gray-700 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">PS</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-white">PharmaStock</h2>
                  <p className="text-xs text-gray-400">Gestion de Stock</p>
                </div>
              </div>
            </div>

            {/* Navigation principale */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
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
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-300 hover:bg-gray-700 hover:shadow-md'
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
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">
                    {user?.username || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email || 'admin@pharmastock.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-800 hover:border-red-700 transition-all duration-200"
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
          <header className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  {sidebarOpen ? (
                    <X className="w-5 h-5 text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-300" />
                  )}
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {activeMenu === '/suppliers' ? 'Fournisseurs' : 'Tableau de bord'}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {activeMenu === '/suppliers' ? 'Gestion des fournisseurs' : 'Vue d\'ensemble'}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Contenu de la page active */}
          <main className="p-6">
            {activeMenu === '/dashboard' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Bienvenue sur PharmaStock
                </h2>
                <p className="text-gray-400">
                  Sélectionnez une section dans le menu de gauche pour commencer.
                </p>
              </div>
            )}

            {activeMenu === '/suppliers' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Gestion des Fournisseurs
                </h2>
                <p className="text-gray-400">
                  Cette section est en cours de développement.
                </p>
              </div>
            )}
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
  }

  // Page des produits
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="h-full bg-gray-800 backdrop-blur-xl border-r border-gray-700 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">PS</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">PharmaStock</h2>
                <p className="text-xs text-gray-400">Gestion de Stock</p>
              </div>
            </div>
          </div>

          {/* Navigation principale */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
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
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-300 hover:bg-gray-700 hover:shadow-md'
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
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || 'admin@pharmastock.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-800 hover:border-red-700 transition-all duration-200"
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
        <header className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-300" />
                )}
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {activeTab === 'normaux' ? 'Médicaments Normaux' : 'Produits Sensibles'}
                </h1>
                <p className="text-sm text-gray-400">
                  Gestion et surveillance des stocks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Bouton Alertes */}
              <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                <AlertTriangle className="w-5 h-5 text-gray-300" />
                {stats.alertes > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {stats.alertes}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Contenu principal des produits */}
        <main className="p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                icon={<Package className="w-5 h-5" />}
                value={stats.normaux}
                label="Produits Normaux"
                color="blue"
              />
              <StatCard 
                icon={<BarChart3 className="w-5 h-5" />}
                value={stats.sensibles}
                label="Produits Sensibles"
                color="purple"
              />
              <StatCard 
                icon={<AlertTriangle className="w-5 h-5" />}
                value={stats.alertes}
                label="Alertes Stock"
                color="orange"
              />
              <StatCard 
                icon={<BarChart3 className="w-5 h-5" />}
                value={`${stats.totalValeur.toFixed(0)}€`}
                label="Valeur Totale"
                color="green"
              />
            </div>

            {/* Controls Bar */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
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
                setShowHistory={handleOpenHistory}
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
                    onEdit={() => handleEditProduct(product, activeTab === 'sensibles')}
                    onDelete={() => handleDelete(product.id, activeTab === 'sensibles')}
                    onView={() => handleViewProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                <ProductTable
                  products={filteredProducts}
                  isSensible={activeTab === 'sensibles'}
                  onEdit={handleEditProduct}
                  onDelete={handleDelete}
                  onView={handleViewProduct}
                />
              </div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <EmptyState onAddProduct={() => {
                setEditingProduct({ isSensible: activeTab === 'sensibles' });
                setShowForm(true);
              }} />
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

      {/* Modals */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          activeTab={activeTab}
        />
      )}

      {showInfo && (
        <InfoModal onClose={() => setShowInfo(false)} />
      )}

      {showHistory && (
        <HistoryModal 
          historique={historique} 
          onClose={() => setShowHistory(false)} 
          darkMode={true}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isSensible={activeTab === 'sensibles'}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => {
            setSelectedProduct(null);
            handleEditProduct(selectedProduct, activeTab === 'sensibles');
          }}
        />
      )}
    </div>
  );
};

// Composants auxiliaires
const StatCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    green: 'bg-green-500 text-white'
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]} shadow-md`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ onAddProduct }) => (
  <div className="bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-700">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
      <Package className="w-10 h-10 text-gray-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">
      Aucun produit trouvé
    </h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">
      Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou ajoutez de nouveaux produits.
    </p>
    <button 
      onClick={onAddProduct}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
    >
      Ajouter un produit
    </button>
  </div>
);

export default Dashboard;
