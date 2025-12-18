import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Package, 
    ShoppingCart, 
    Truck, 
    BarChart3, 
    Menu, 
    X, 
    LogOut, 
    ChevronRight,
    Search,
    Filter,
    Plus,
    Minus,
    ShoppingBag,
    Trash2,
    Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
const BuyingPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const activeMenu = location.pathname; // Auto-detect active route
    const { logout } = useAuth();
    // Mock user data
    const user = {
        username: 'John Doe',
        email: 'john@example.com'
    };

    const menuItems = [
        { path: '/dashboard', icon: BarChart3, label: 'Tableau de Bord' },
        { path: '/products', icon: Package, label: 'Gestion Produits' },
        { path: '/suppliers', icon: Truck, label: 'Commandes Fournisseurs' },
   
    ];

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/api/produits');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    const fetchCartItems = async () => {
        try {
          const res = await fetch("http://localhost:5002/api/cart");
          if (!res.ok) throw new Error("Failed to fetch cart");
      
          const cartItems = await res.json();
          // cartItems = [{ id, product_id, quantity }]
      
          // Map backend cart items to frontend cart shape
          const enrichedCart = cartItems.map(cartItem => {
            const product = products.find(p => p.id === cartItem.product_id);
      
            return {
              id: cartItem.id,          // cart item ID
              quantity: cartItem.quantity,
              product                   // full product object
            };
          }).filter(item => item.product); // safety
      
          setCart(enrichedCart);
        } catch (error) {
          console.error(error);
        }
      };
      useEffect(() => {
        if (products.length > 0) {
            fetchCartItems();
        }
    }, [products]);
    const handleAddToCart = async (product, quantity = 1) => {
        try {
            const res = await fetch('http://localhost:5002/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id, quantity })
            });
            
            if (!res.ok) {
                alert('❌ Failed to add to cart');
                return;
            }
            
            const newCartItem = await res.json();
            
            // Update local cart state
            const existingItem = cart.find(item => item.product.id === product.id);
            if (existingItem) {
                setCart(cart.map(item => 
                    item.product.id === product.id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                ));
            } else {
                setCart([...cart, { ...newCartItem, product, quantity }]);
            }
            
            alert(`✅ Added ${quantity} x ${product.nom} to cart`);
        } catch (err) {
            console.error(err);
            alert('❌ Error adding to cart');
        }
    };

    const updateQuantity = async (cartItemId, change) => {
        const item = cart.find(item => item.id === cartItemId);
        if (!item) return;
      
        const newQuantity = item.quantity + change;
      
        if (newQuantity <= 0) {
          setCart(cart.filter(i => i.id !== cartItemId));
          return;
        }
      
        try {
          const res = await fetch(`http://localhost:5002/api/cart/${cartItemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity })
          });
      
          if (!res.ok) throw new Error("Failed to update quantity");
      
          const updatedItem = await res.json();
      
          // ✅ ONLY update quantity, keep product
          setCart(cart.map(item =>
            item.id === cartItemId
              ? { ...item, quantity: updatedItem.quantity }
              : item
          ));
        } catch (error) {
          console.error(error);
        }
      };
      
      const removeFromCart = async (cartItemId) => {
        console.log("Deleting cart item with ID:", cartItemId);
        try {
          const res = await fetch(`http://localhost:5002/api/cart/${cartItemId}`, {
            method: "DELETE"
          });
      
          if (!res.ok && res.status !== 204) {
            throw new Error("Failed to delete cart item");
          }
      
          setCart(cart.filter(item => item.id !== cartItemId));
        } catch (error) {
          console.error(error);
        }
      };
      
      

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.product.prix * item.quantity), 0);
    };

    const checkoutthing = async () => {
        try {
          const product_ids = cart.map(item => item.product.id);
          const body = {
            name: "My Shop",
            accumulated_price: getTotalPrice(),
            product_ids
          };
      
          const res = await fetch('http://localhost:5002/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            throw new Error(data.error || 'Checkout failed');
          }
      
          console.log('Checkout success:', data);
      
          // Refresh the page after successful checkout
          window.location.reload();
      
        } catch (error) {
          console.error('Checkout error:', error.message);
        }
      };
      
    // Get unique manufacturers
    const manufacturers = [...new Set(products.map(p => p.nom_fabricant))].filter(Boolean);

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesManufacturer = !selectedManufacturer || product.nom_fabricant === selectedManufacturer;
        return matchesSearch && matchesManufacturer;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-light-100 dark:bg-dark-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-light-600 dark:text-dark-400 font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-100 dark:bg-dark-950">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen transition-transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 w-64`}
            >
                <div className="h-full glass border-r border-light-300 dark:border-dark-700 flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-light-300 dark:border-dark-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">PS</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-light-900 dark:text-dark-50">PharmaStock</h2>
                                <p className="text-xs text-light-600 dark:text-dark-400">Gestion Stock</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = activeMenu === item.path;

                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => {
                                            navigate(item.path);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                            active
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                : 'text-light-700 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-800'
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

                    {/* User Info */}
                    <div className="p-4 border-t border-light-300 dark:border-dark-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-light-900 dark:text-dark-50 truncate">
                                    {user.username}
                                </p>
                                <p className="text-xs text-light-600 dark:text-dark-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                {/* Top Bar */}
                <header className="glass border-b border-light-300 dark:border-dark-700 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-light-200 dark:hover:bg-dark-800 rounded-lg transition-all"
                        >
                            {sidebarOpen ? (
                                <X className="w-5 h-5 text-light-900 dark:text-dark-50" />
                            ) : (
                                <Menu className="w-5 h-5 text-light-900 dark:text-dark-50" />
                            )}
                        </button>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm font-medium text-light-900 dark:text-dark-50">
                                    Bonjour, {user.username}!
                                </p>
                                <p className="text-xs text-light-600 dark:text-dark-400">
                                    Parcourez nos produits
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCart(!showCart)}
                                className="relative p-2 hover:bg-light-200 dark:hover:bg-dark-800 rounded-lg transition-all"
                            >
                                <ShoppingBag className="w-5 h-5 text-light-900 dark:text-dark-50" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <div className="space-y-6 animate-fade-in">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-light-900 dark:text-dark-50 mb-2">
                                Products
                            </h1>
                            <p className="text-light-600 dark:text-dark-400">
                                Parcourez et commandez des produits pour votre stock
                            </p>
                        </div>

                        {/* Search and Filter */}
                        <div className="card">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-400 dark:text-dark-500" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un produit..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-light-200 dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-light-900 dark:text-dark-50"
                                    />
                                </div>
                                <div className="relative min-w-[200px]">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-400 dark:text-dark-500" />
                                    <select
                                        value={selectedManufacturer}
                                        onChange={(e) => setSelectedManufacturer(e.target.value)}
                                        className="w-full pl-10 pr-8 py-3 bg-light-200 dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-light-900 dark:text-dark-50 appearance-none cursor-pointer"
                                    >
                                        <option value="">All Manufacturers</option>
                                        {manufacturers.map(manufacturer => (
                                            <option key={manufacturer} value={manufacturer}>
                                                {manufacturer}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="card hover:shadow-2xl transition-all duration-300 group"
                                >
                                    <div className="text-center mb-4">
                                        <div className="w-full h-32 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-lg flex items-center justify-center mb-4">
                                            <Package className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-light-900 dark:text-dark-50 mb-2">
                                            {product.nom}
                                        </h3>
                                        {product.description && (
                                            <p className="text-sm text-light-600 dark:text-dark-400 mb-3">
                                                {product.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-light-500 dark:text-dark-500">
                                                {product.nom_fabricant || 'N/A'}
                                            </span>
                                            {product.quantite !== undefined && (
                                                <span className={`text-xs font-semibold ${
                                                    product.quantite > 100 
                                                        ? 'text-green-600 dark:text-green-400' 
                                                        : product.quantite > 0
                                                            ? 'text-yellow-600 dark:text-yellow-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                    Stock: {product.quantite}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-light-300 dark:border-dark-700 pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                                {product.prix ? `${product.prix} DA` : 'N/A'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product, 1)}
                                            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg transition-all font-medium group-hover:scale-105"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Ajouter au Panier
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="card text-center py-12">
                                <Package className="w-16 h-16 text-light-400 dark:text-dark-500 mx-auto mb-4" />
                                <p className="text-lg font-medium text-light-600 dark:text-dark-400">
                                    Aucun produit trouvé
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Cart Sidebar */}
            <div
                className={`fixed right-0 top-0 h-screen w-96 glass border-l border-light-300 dark:border-dark-700 z-50 transition-transform ${
                    showCart ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-light-300 dark:border-dark-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-light-900 dark:text-dark-50">
                                Panier
                            </h2>
                            <button
                                onClick={() => setShowCart(false)}
                                className="p-2 hover:bg-light-200 dark:hover:bg-dark-800 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5 text-light-900 dark:text-dark-50" />
                            </button>
                        </div>
                        <p className="text-sm text-light-600 dark:text-dark-400 mt-1">
                            {cart.length} article{cart.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="w-16 h-16 text-light-400 dark:text-dark-500 mx-auto mb-4" />
                                <p className="text-light-600 dark:text-dark-400">
                                    Votre panier est vide
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="bg-light-200 dark:bg-dark-800 rounded-lg p-4"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-light-900 dark:text-dark-50 mb-1">
                                                {item.product.nom}
                                            </h3>
                                            <p className="text-sm text-light-600 dark:text-dark-400">
                                                {item.product.prix} DA
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded text-red-600 dark:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center bg-light-300 dark:bg-dark-700 rounded hover:bg-light-400 dark:hover:bg-dark-600 transition-all"
                                            >
                                                <Minus className="w-4 h-4 text-light-900 dark:text-dark-50" />
                                            </button>
                                            <span className="w-12 text-center font-bold text-light-900 dark:text-dark-50">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-light-300 dark:bg-dark-700 rounded hover:bg-light-400 dark:hover:bg-dark-600 transition-all"
                                            >
                                                <Plus className="w-4 h-4 text-light-900 dark:text-dark-50" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-primary-600 dark:text-primary-400">
                                            {item.product.prix * item.quantity} DA
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="p-6 border-t border-light-300 dark:border-dark-700">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-bold text-light-900 dark:text-dark-50">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {getTotalPrice()} DA
                                </span>
                            </div>
                            <button
                              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg transition-all font-medium"
                               onClick={checkoutthing}
                             >
                             <Check className="w-5 h-5" />
                             Confirmer la Commande
                              </button>

                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Cart Overlay */}
            {showCart && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowCart(false)}
                />
            )}

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }

                .card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .dark .card {
                    background: rgba(30, 30, 40, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .glass {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                }

                .dark .glass {
                    background: rgba(20, 20, 30, 0.9);
                }
            }`}</style>
        </div>
    );
};

export default BuyingPage;