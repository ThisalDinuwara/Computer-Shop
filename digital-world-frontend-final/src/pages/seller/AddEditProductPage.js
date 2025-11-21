import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  X,
  Package
} from 'lucide-react';
import { sellerAPI } from '../../services/api';
import Loading from '../../components/Loading';

const AddEditProductPage = () => {
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mrpPrice: '',
    sellingPrice: '',
    color: '',
    images: [''],
    category: '',
    category2: '',
    category3: '',
    sizes: '',
    quantity: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getProducts();
      const product = response.data.find((p) => p.id === parseInt(productId));
      if (product) {
        setFormData({
          title: product.title || '',
          description: product.description || '',
          mrpPrice: product.mrpPrice || '',
          sellingPrice: product.sellingPrice || '',
          color: product.color || '',
          images: product.images?.length > 0 ? product.images : [''],
          category: product.category?.name || '',
          category2: product.category?.parentCategory?.name || '',
          category3: product.category?.parentCategory?.parentCategory?.name || '',
          sizes: product.sizes || '',
          quantity: product.quantity || '',
        });
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Product title is required');
      setSaving(false);
      return;
    }
    if (!formData.mrpPrice || formData.mrpPrice <= 0) {
      setError('Valid MRP price is required');
      setSaving(false);
      return;
    }
    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      setError('Valid selling price is required');
      setSaving(false);
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      setSaving(false);
      return;
    }
    if (!formData.quantity || formData.quantity < 0) {
      setError('Valid quantity is required');
      setSaving(false);
      return;
    }

    const productData = {
      ...formData,
      mrpPrice: parseInt(formData.mrpPrice),
      sellingPrice: parseInt(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
      images: formData.images.filter((img) => img.trim() !== ''),
    };

    try {
      if (isEditMode) {
        await sellerAPI.updateProduct(productId, productData);
        setSuccess('Product updated successfully!');
      } else {
        await sellerAPI.createProduct(productData);
        setSuccess('Product created successfully!');
      }
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller/products')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Package className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode
                  ? 'Update your product information'
                  : 'Fill in the details to add a new product'}
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter product title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your product"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Red, Blue, Black"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MRP Price (₹) *
                </label>
                <input
                  type="number"
                  name="mrpPrice"
                  value={formData.mrpPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            {formData.mrpPrice && formData.sellingPrice && (
              <div className="mt-3 text-sm text-gray-600">
                Discount:{' '}
                <span className="font-medium text-green-600">
                  {Math.round(
                    ((formData.mrpPrice - formData.sellingPrice) / formData.mrpPrice) * 100
                  )}
                  % off
                </span>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Electronics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="category2"
                  value={formData.category2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Smartphones"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Third Category
                </label>
                <input
                  type="text"
                  name="category3"
                  value={formData.category3}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Android Phones"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Sizes
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., S, M, L, XL or 32GB, 64GB, 128GB"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter sizes separated by commas
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
              <button
                type="button"
                onClick={addImageField}
                className="flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                <Plus size={18} className="mr-1" />
                Add Image URL
              </button>
            </div>
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <ImageIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* Image Previews */}
            {formData.images.some((img) => img.trim() !== '') && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Previews:</p>
                <div className="flex flex-wrap gap-3">
                  {formData.images
                    .filter((img) => img.trim() !== '')
                    .map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/96?text=Invalid';
                        }}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProductPage;