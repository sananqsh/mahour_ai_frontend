import React from 'react';
import { Star, RefreshCw } from 'lucide-react';
import { Product } from '../../services/types';
import { formatCurrency } from '../../utils/formatters';

interface RecommendationsProps {
  recommendations: Product[];
  loading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  loading,
  error,
  onRefresh
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Recommendations</h2>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
        Get New Suggestions
      </button>
    </div>

    {loading && <div className="text-center py-8">Loading recommendations...</div>}
    {error && <div className="text-center py-8 text-red-600">Error loading recommendations: {error.message}</div>}

    {recommendations && recommendations.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(product => (
          <div key={product.id || product.product_id} className="bg-white p-6 rounded-lg shadow">
            <img
              src={product.imageUrl || product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop'}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-xl font-bold text-blue-600 mb-3">{formatCurrency(product.price)}</p>
            <p className="text-sm text-gray-600 mb-4">{product.rationale}</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    ) : !loading && !error && (
      <div className="text-center py-12">
        <Star className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600">Click "Get New Suggestions" to see personalized recommendations!</p>
      </div>
    )}
  </div>
);
