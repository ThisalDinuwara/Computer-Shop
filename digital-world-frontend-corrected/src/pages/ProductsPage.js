import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    color: searchParams.get('color') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minDiscount: searchParams.get('minDiscount') || '',
    sort: searchParams.get('sort') || '',
    stock: searchParams.get('stock') || '',
  });

  const searchQuery = searchParams.get('search') || '';

  // Popular options for quick selection
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty'];
  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'LG', 'Dell'];
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Brown', hex: '#92400E' },
  ];
  const discountOptions = [10, 20, 30, 40, 50];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await productAPI.search(searchQuery);
        setProducts(response.data || []);
        setTotalPages(1);
      } else {
        response = await productAPI.getAll({
          ...filters,
          pageNumber: currentPage,
        });
        const data = response.data;
        setProducts(data.content || data || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(0);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
    fetchProducts();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      minDiscount: '',
      sort: '',
      stock: '',
    });
    setSearchParams({});
    setCurrentPage(0);
  };

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'discount', label: 'Highest Discount' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {products.length} products found
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center md:hidden"
            >
              <Filter size={20} className="mr-2" />
              Filters
            </button>
            <select
              value={filters.sort}
              onChange={(e) => {
                handleFilterChange('sort', e.target.value);
                setTimeout(() => applyFilters(), 0);
              }}
              className="input-field w-48"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block w-full md:w-72 flex-shrink-0`}
          >
            <div className="card sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Category - Pills */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        filters.category === cat
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {/* Custom category input */}
                <input
                  type="text"
                  value={!categories.includes(filters.category) ? filters.category : ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field mt-2 text-sm"
                  placeholder="Or type custom category..."
                />
              </div>

              {/* Brand - Pills */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleFilterChange('brand', filters.brand === brand ? '' : brand)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        filters.brand === brand
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
                {/* Custom brand input */}
                <input
                  type="text"
                  value={!brands.includes(filters.brand) ? filters.brand : ''}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="input-field mt-2 text-sm"
                  placeholder="Or type custom brand..."
                />
              </div>

              {/* Color - Swatches */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleFilterChange('color', filters.color === color.name ? '' : color.name)}
                      className={`relative group`}
                      title={color.name}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 transform hover:scale-110 ${
                          filters.color === color.name
                            ? 'border-blue-600 dark:border-blue-400 ring-4 ring-blue-200 dark:ring-blue-900/50 scale-110'
                            : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'
                        } ${color.name === 'White' ? 'border-gray-400 dark:border-gray-600' : ''}`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {filters.color === color.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check 
                              className={`${color.name === 'White' || color.name === 'Yellow' ? 'text-gray-700' : 'text-white'}`} 
                              size={20} 
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block text-center">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Price Range (LKR)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Min Discount - Pills */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Discount
                </label>
                <div className="flex flex-wrap gap-2">
                  {discountOptions.map((discount) => (
                    <button
                      key={discount}
                      onClick={() => handleFilterChange('minDiscount', filters.minDiscount === String(discount) ? '' : String(discount))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        filters.minDiscount === String(discount)
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                      }`}
                    >
                      {discount}% OFF
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock - Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Availability
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('stock', filters.stock === 'in_stock' ? '' : 'in_stock')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filters.stock === 'in_stock'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                    }`}
                  >
                    In Stock
                  </button>
                  <button
                    onClick={() => handleFilterChange('stock', filters.stock === 'out_of_stock' ? '' : 'out_of_stock')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filters.stock === 'out_of_stock'
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                    }`}
                  >
                    Out of Stock
                  </button>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={applyFilters}
                className="w-full btn-primary py-3 flex items-center justify-center"
              >
                <Filter size={20} className="mr-2" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <Loading text="Loading products..." />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div key={product.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (currentPage < 3) {
                          pageNum = i;
                        } else if (currentPage > totalPages - 4) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 border-2 rounded-xl font-medium transition-all transform hover:scale-105 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                        }
                        disabled={currentPage === totalPages - 1}
                        className="px-4 py-2 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card p-12 text-center animate-fade-in">
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No products found.</p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
