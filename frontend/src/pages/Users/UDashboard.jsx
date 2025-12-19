import { useEffect, useState } from 'react';
import { 
    Package, ShoppingCart, Truck, Plus, BarChart3, Menu, X, LogOut, ChevronRight,
    Shield, Clock, Award, Zap, Users, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [animationStep, setAnimationStep] = useState(0);

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const user = {
        username: 'John Doe',
        email: 'john@example.com'
    };

    const menuItems = [
        { path: '/dashboard', icon: BarChart3, label: 'Tableau de Bord' },
        { path: '/products', icon: Package, label: 'Gestion Produits' },
        { path: '/suppliers', icon: Truck, label: 'Commandes Fournisseurs' },
    ];

    const [activeMenu, setActiveMenu] = useState(location.pathname);
    useEffect(() => setActiveMenu(location.pathname), [location.pathname]);

    // Welcome Animation
    useEffect(() => {
        if (showWelcome) {
            const t1 = setTimeout(() => setAnimationStep(1), 500);
            const t2 = setTimeout(() => setAnimationStep(2), 1500);
            const t3 = setTimeout(() => setAnimationStep(3), 2500);
            const t4 = setTimeout(() => setShowWelcome(false), 4000);
            return () => [t1,t2,t3,t4].forEach(clearTimeout);
        }
    }, [showWelcome]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const features = [
        {
            title: "Sécurité Fiable",
            description: "Protection avancée de vos données et transactions.",
            icon: Shield,
            color: "bg-blue-500"
        },
        {
            title: "Support 24/7",
            description: "Assistance continue pour vos besoins critiques.",
            icon: Clock,
            color: "bg-green-500"
        },
        {
            title: "Qualité Garantie",
            description: "Produits certifiés et conformes aux normes.",
            icon: Award,
            color: "bg-yellow-500"
        },
        {
            title: "Livraison Rapide",
            description: "Acheminement fiable et ponctuel.",
            icon: Truck,
            color: "bg-red-500"
        },
        {
            title: "Haute Performance",
            description: "Système optimisé et fluide.",
            icon: Zap,
            color: "bg-purple-500"
        },
        {
            title: "Clients Satisfaits",
            description: "Plus de 200 partenaires confiants.",
            icon: Users,
            color: "bg-pink-500"
        },
    ];

    // ===================== WELCOME SCREEN =====================
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

    // ===================== MAIN LAYOUT =====================
    return (
        <div className="min-h-screen bg-light-100 dark:bg-dark-950">

            {/* SIDEBAR */}
            <aside className={`fixed left-0 top-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64`}>
                <div className="h-full glass border-r border-dark-700 flex flex-col">
                    
                    <div className="p-6 border-b border-dark-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">PS</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-white">PharmaStock</h2>
                                <p className="text-xs text-dark-400">Gestion Stock</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {menuItems.map(item => {
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
                                                : 'text-dark-200 hover:bg-dark-800'
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

                    <div className="p-4 border-t border-dark-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-white truncate">
                                    {user.username}
                                </p>
                                <p className="text-xs text-dark-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                <header className="glass border-b border-dark-700 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-dark-800 rounded-lg">
                            {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                        </button>
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">Bonjour, {user.username}!</p>
                            <p className="text-xs text-dark-400">Gérez votre stock efficacement</p>
                        </div>
                    </div>
                </header>

                <main className="p-6 max-w-7xl mx-auto space-y-8">

                    {/* HERO */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white shadow-2xl p-12">
                        <h1 className="text-4xl font-bold mb-3">À Propos de PharmaStock</h1>
                        <p className="text-lg opacity-90 max-w-4xl">
                            PharmaStock est votre partenaire de confiance dédié à la fourniture et au stockage
                            des suppléments et dispositifs médicaux pour les pharmacies et hôpitaux.
                        </p>
                    </div>

                    {/* MISSION */}
                    <div className="card text-center">
                        <h2 className="text-3xl font-bold text-white mb-3">Notre Mission</h2>
                        <p className="text-dark-300 max-w-3xl mx-auto">
                            Offrir un accès fiable et abordable aux équipements médicaux essentiels.
                        </p>
                    </div>

                    {/* FEATURES */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">
                            Pourquoi Choisir PharmaStock?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <div key={i} className="card hover:scale-105 transition-all">
                                        <div className={`${f.color} p-4 rounded-2xl w-fit mb-3`}>
                                            <Icon className="text-white w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {f.title}
                                        </h3>
                                        <p className="text-dark-300">{f.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)} />
            )}

            {/* STYLES */}
            <style>{`
                .card {
                    background: rgba(30,30,40,0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .glass {
                    background: rgba(20,20,30,0.9);
                    backdrop-filter: blur(10px);
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;
