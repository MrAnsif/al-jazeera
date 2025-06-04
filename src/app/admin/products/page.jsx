'use client'
import { useState, useEffect } from 'react';
import { Plus, X, Upload, Loader2, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showInDetail, setShowInDetail] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    images: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // 1. Extract categories only when products change
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // 2. Filter and sort products on any relevant change
  useEffect(() => {
    if (products.length > 0) {
      filterAndSortProducts();
    }
  }, [products, searchTerm, searchCategory, sortOption]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    // Filter by search term (name)
    if (searchTerm) {
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (searchCategory) {
      result = result.filter(product =>
        product.category?.toLowerCase().includes(searchCategory.toLowerCase())
      )
    }

    // Sort products
    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'category-asc':
        result.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      case 'category-desc':
        result.sort((a, b) => (b.category || '').localeCompare(a.category || ''));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleCancel = async () => {
    setShowAddModal(false)
    setFormData({ name: '', description: '', category: '', images: [] });
  }

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    try {
      setDeleteConfirmed(true);
      const response = await fetch(`/api/admin/products/${pendingDeleteId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setProducts(prev => prev.filter(p => p._id !== pendingDeleteId));
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting product');
    } finally {
      setDeleteConfirmed(false);
      setShowConfirm(false);
      setPendingDeleteId(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);

      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product added successfully')
        setProducts(prev => [data.data, ...prev]);
        setShowAddModal(false);
        setFormData({ name: '', description: '', category: '', price: '', images: [] });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getCoverImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return '/images/no-img.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  const handleShowDetail = (product) => {
    setCurrentProduct(product);
    setShowInDetail(true);
    setCurrentImageIndex(0);
  };

  const handleEditProduct = () => {
    setEditing(true);
    setFormData({
      name: currentProduct.name,
      description: currentProduct.description,
      category: currentProduct.category,
      price: currentProduct.price,
      images: []
    });
  };

  const handleUpdateProduct = async () => {
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);

      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`/api/admin/products/${currentProduct._id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Product updated successfully');
        setProducts(prev => prev.map(p => p._id === currentProduct._id ? data.data : p));
        setCurrentProduct(data.data);
        setEditing(false);
        setFormData({ name: '', description: '', category: '', price: '', images: [] });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex(prev =>
      prev === currentProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? currentProduct.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by Name
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category || 'Uncategorized'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="category-asc">Category (A-Z)</option>
              <option value="category-desc">Category (Z-A)</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleShowDetail(product)}>
                {getCoverImage(product) && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={getCoverImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 flex justify-between">
                  <div className='overflow-hidden'>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2 line-clamp-3">
                      <span className='font-semibold'>Category:</span> {product.category || 'N/A'}
                    </p>
                    <p className="text-green-700 mb-2 ">
                      <span className='font-semibold'>Price:</span> {product.price || ''}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-1">
                      {product.description || 'N/A'}
                    </p>

                  </div>
                  <div className="">
                    <button type="button" className='cursor-pointer text-red-800'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product._id);
                      }}><Trash2 className='h-5 w-5' /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showInDetail && currentProduct && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editing ? 'Edit Product' : 'Product Details'}
                </h2>
                <button
                  onClick={() => {
                    setShowInDetail(false);
                    setEditing(false);
                    setFormData({ name: '', description: '', category: '', price: '', images: [] });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!editing ? (
                <>
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                    {currentProduct.images?.length > 0 && (
                      <>
                        <img
                          src={currentProduct.images[currentImageIndex]}
                          alt={currentProduct.name}
                          className="w-full h-full object-cover"
                        />
                        {currentProduct.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {currentProduct.images.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{currentProduct.name}</h3>
                      <p className="text-gray-600">Category: {currentProduct.category || 'N/A'}</p>
                      <p className="text-gray-600">Price: {currentProduct.price || ''}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Description</h4>
                      <p className="text-gray-600 whitespace-pre-line">
                        {currentProduct.description || 'No description provided'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Images ({currentProduct.images?.length || 0})</h4>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {currentProduct.images?.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`${currentProduct.name} ${index + 1}`}
                            className="aspect-square object-cover rounded cursor-pointer"
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleDelete(currentProduct._id)}
                        className="flex-1 px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete
                      </button>
                      <button
                        onClick={handleEditProduct}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        Edit
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Enter product category"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price ?? ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Enter product price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Change Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="edit-images"
                      />
                      <label htmlFor="edit-images" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Click to upload image
                        </p>
                      </label>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          {formData.images.length} new image{formData.images.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="space-y-2">
                          {Array.from(formData.images).map((file, index) => (
                            <div key={index} className="grid grid-cols-[1fr_0.2fr_0.1fr] bg-gray-50 px-3 py-2 rounded">
                              <span className="text-sm text-gray-700 truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                              <button
                                onClick={() =>
                                  setFormData(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }))
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({ name: '', description: '', category: '', price: '', images: [] });
                      }}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={submitting}
                      onClick={handleUpdateProduct}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Product'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4">
            <h1 className='text-xl font-semibold'>Are you sure to <span className='text-red-500'>delete</span> this product?</h1>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={deleteConfirmed}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmed}
                onClick={confirmDelete}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteConfirmed ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter product category"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter product price"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="images"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Click to upload images or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG ...
                    </p>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.images.length} file{formData.images.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="space-y-2">
                      {Array.from(formData.images).map((file, index) => (
                        <div key={index} className="grid grid-cols-[1fr_0.2fr_0.1fr] bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm text-gray-700 truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <button
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }))
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}