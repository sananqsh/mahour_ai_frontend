import React from 'react';
import { ShoppingBag, TrendingUp, Star, Gift } from 'lucide-react';
import { DashboardData } from '../../services/types';
import { formatCurrency } from '../../utils/formatters';

interface DashboardProps {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: Error | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ dashboardData, loading, error }) => {
  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading dashboard: {error.message}</div>;
  if (!dashboardData) return <div className="text-center py-8">No data available</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.totalOrders || 0}</p>
            </div>
            <ShoppingBag className="text-blue-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData.totalSpent || 0)}</p>
            </div>
            <TrendingUp className="text-green-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Tier</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboardData.tier || 'N/A'}</p>
            </div>
            <Star className="text-yellow-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-purple-600">{dashboardData.points || 0}</p>
            </div>
            <Gift className="text-purple-600" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};
