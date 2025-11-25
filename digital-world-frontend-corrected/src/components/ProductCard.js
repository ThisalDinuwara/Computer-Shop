import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Sparkles } from 'lucide-react';

const ProductCard = ({ product }) => {
  const discountPercentage = product.discountPercent || 
    Math.round(((product.mrpPrice - product.sellingPrice) / product.mrpPrice) * 100);

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="card group cursor-pointer animate-fade-in">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg animate-scale-in">
              <Sparkles size={14} className="inline mr-1" />
              {discountPercentage}% OFF
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg px-4 py-2 bg-red-500/80 rounded-xl">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center mb-3">
            {product.numRatings > 0 ? (
              <>
                <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {(product.numRatings / 5).toFixed(1)}
                  </span>
                </div>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.reviews?.length || 0} reviews
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">No ratings yet</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                LKR {product.sellingPrice?.toLocaleString()}
              </span>
              {product.mrpPrice > product.sellingPrice && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                  LKR {product.mrpPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          {product.color && (
            <div className="mt-3 flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Color: </span>
              <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300 px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded-lg">
                {product.color}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
