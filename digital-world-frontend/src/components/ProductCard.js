import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const discountPercentage = product.discountPercent || 
    Math.round(((product.mrpPrice - product.sellingPrice) / product.mrpPrice) * 100);

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="card group cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-gray-900 font-medium text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center mb-2">
            {product.numRatings > 0 ? (
              <>
                <div className="flex items-center text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-sm text-gray-600">
                    {(product.numRatings / 5).toFixed(1)}
                  </span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {product.reviews?.length || 0} reviews
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No ratings yet</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.sellingPrice?.toLocaleString()}
              </span>
              {product.mrpPrice > product.sellingPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₹{product.mrpPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          {product.color && (
            <div className="mt-2">
              <span className="text-xs text-gray-500">Color: </span>
              <span className="text-xs font-medium text-gray-700">{product.color}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
