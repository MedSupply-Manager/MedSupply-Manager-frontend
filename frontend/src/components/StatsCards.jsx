import React from 'react';
import { Package, Shield, AlertCircle, BarChart3 } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatCard 
        icon={<Package className="w-4 h-4" />}
        value={stats.normaux}
        label="Produits"
        color="blue"
      />
      <StatCard 
        icon={<Shield className="w-4 h-4" />}
        value={stats.sensibles}
        label="Sensibles"
        color="purple"
      />
      <StatCard 
        icon={<AlertCircle className="w-4 h-4" />}
        value={stats.alertes}
        label="Alertes"
        color="orange"
      />
      <StatCard 
        icon={<BarChart3 className="w-4 h-4" />}
        value={`${stats.totalValeur.toFixed(0)}€`}
        label="Valeur"
        color="green"
      />
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    green: 'bg-green-500 text-white'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;