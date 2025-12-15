import { useEffect, useState } from 'react';
import { 
    Package, ShoppingCart, Truck, Plus, BarChart3, Menu, X, LogOut, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [animationStep, setAnimationStep] = useState(0);

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // auto-detect active route

    // Mock user data
    const user = {
        username: 'John Doe',
        email: 'john@example.com'
    };

    const menuItems = [
        { path: '/dashboard', icon: BarChart3, label: 'Tableau de Bord' },
        { path: '/products', icon: Package, label: 'Gestion Produits' },
        { path: '/suppliers', icon: Truck, label: 'Commandes Fournisseurs' },
        { path: '/orders', icon: ShoppingCart, label: 'Commandes Clients' },
    ];

    const [activeMenu, setActiveMenu] = useState(location.pathname);

    useEffect(() => {
        setActiveMenu(location.pathname); // update active menu on route change
    }, [location.pathname]);

    useEffect(() => {
        if (showWelcome) {
            const timer1 = setTimeout(() => setAnimationStep(1), 500);
            const timer2 = setTimeout(() => setAnimationStep(2), 1500);
            const timer3 = setTimeout(() => setAnimationStep(3), 2500);
            const timer4 = setTimeout(() => setShowWelcome(false), 5000);
            
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
            };
        }
    }, [showWelcome]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const stats = [
        {
            title: 'Produits en Stock',
            value: '1,234',
            icon: Package,
            color: 'primary',
            bgColor: 'bg-primary-500',
            trend: '+12%'
        },
        {
            title: 'Commandes en Cours',
            value: '45',
            icon: ShoppingCart,
            color: 'blue',
            bgColor: 'bg-blue-500',
            trend: '+8%'
        },
        {
            title: 'Fournisseurs Actifs',
            value: '23',
            icon: Truck,
            color: 'green',
            bgColor: 'bg-green-500',
            trend: '+3'
        },
        {
            title: 'Ventes du Mois',
            value: '89,450 DA',
            icon: BarChart3,
            color: 'yellow',
            bgColor: 'bg-yellow-500',
            trend: '+18%'
        },
    ];

    const quickActions = [
        {
            title: 'Ajouter un Produit',
            description: 'Créer un nouveau produit dans votre catalogue',
            icon: Plus,
            color: 'bg-primary-500',
            action: '/products/new'
        },
        {
            title: 'Nouvelle Commande Fournisseur',
            description: 'Commander des produits auprès de vos fournisseurs',
            icon: Truck,
            color: 'bg-blue-500',
            action: '/suppliers/order'
        },
        {
            title: 'Gérer les Commandes',
            description: 'Voir et traiter les commandes clients',
            icon: ShoppingCart,
            color: 'bg-green-500',
            action: '/orders'
        },
    ];

    if (showWelcome) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className={`transition-all duration-700 ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <span className="text-primary-600 font-bold text-4xl">PS</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Bienvenue sur PharmaStock
                        </h1>
                    </div>
                    
                    <div className={`transition-all duration-700 delay-300 ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Votre partenaire de confiance pour la gestion des stocks pharmaceutiques
                        </p>
                    </div>

                    <div className={`transition-all duration-700 delay-500 ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="inline-block animate-pulse">
                            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    </div>
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
                                            setActiveMenu(item.path);
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

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-light-900 dark:text-dark-50">
                                    Bonjour, {user.username}!
                                </p>
                                <p className="text-xs text-light-600 dark:text-dark-400">
                                    Gérez votre stock efficacement
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <div className="space-y-6 animate-fade-in">
                        {/* Company Info Section */}
                        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-3">À propos de PharmaStock</h2>
                                    <p className="text-white/90 mb-4 leading-relaxed">
                                        PharmaStock est votre plateforme de gestion de stock pharmaceutique qui facilite la connexion entre 
                                        <span className="font-semibold"> fabricants et consommateurs</span>. Nous agissons comme un intermédiaire de confiance, 
                                        simplifiant le processus de distribution et garantissant un accès efficace aux produits pharmaceutiques.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                            <span className="text-sm">Gestion centralisée</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                            <span className="text-sm">Suivi en temps réel</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                            <span className="text-sm">Distribution optimisée</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div>
                            <h3 className="text-xl font-bold text-light-900 dark:text-dark-50 mb-4">
                                Vue d'ensemble
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="card hover:shadow-2xl transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                                                    {stat.trend}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-light-600 dark:text-dark-400 mb-1">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-light-900 dark:text-dark-50">
                                                {stat.value}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-xl font-bold text-light-900 dark:text-dark-50 mb-4">
                                Actions Rapides
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => navigate(action.action)}
                                            className="card hover:shadow-2xl transition-all duration-300 text-left group"
                                        >
                                            <div className={`${action.color} p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="text-lg font-bold text-light-900 dark:text-dark-50 mb-2">
                                                {action.title}
                                            </h4>
                                            <p className="text-sm text-light-600 dark:text-dark-400">
                                                {action.description}
                                            </p>
                                            <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm">
                                                Commencer
                                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Custom Styles */}
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
            `}</style>
        </div>
    );
};

export default UserDashboard;
