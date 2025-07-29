import React from 'react';
import { Order } from '../../services/types';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface OrdersProps {
  orders: Order[];
  loading: boolean;
  error: Error | null;
}

export const Orders: React.FC<OrdersProps> = ({ orders, loading, error }) => {
  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading orders: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.date || order.created_at)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.items?.length || 0} item(s)</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
};
