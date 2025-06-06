"use client";
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, ChevronDown, SortAsc } from 'lucide-react';

const ProductsPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');

  const products = [
    {
      id: 1,
      name: 'TADANO AML K COMPUTER',
      category: 'Control Systems',
      image: '/images/no-img.jpg',
      price: 1299.00,
      priceDisplay: 'AED 1,299.00',
      availability: 'In Stock'
    },
    {
      id: 2,
      name: 'TADANO AML LC STICKER',
      category: 'Spare Parts',
      image: '/images/no-img.jpg',
      price: 89.00,
      priceDisplay: 'AED 89.00',
      availability: 'In Stock'
    },
    {
      id: 3,
      name: 'TADANO AML Z STICKER',
      category: 'Spare Parts',
      image: '/images/no-img.jpg',
      price: 95.00,
      priceDisplay: 'AED 95.00',
      availability: 'In Stock'
    },
    {
      id: 4,
      name: 'CRANE LCD DISPLAY MODULE',
      category: 'Displays',
      image: '/images/no-img.jpg',
      price: 485.00,
      priceDisplay: 'AED 485.00',
      availability: 'In Stock'
    },
  ];

  const categories = ['All', 'Spare Parts', 'Control Systems', 'Displays', 'Hydraulic Parts', 'Safety Equipment', 'Services'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under500', label: 'Under AED 500' },
    { value: '500to2000', label: 'AED 500 - 2,000' },
    { value: '2000to5000', label: 'AED 2,000 - 5,000' },
    { value: 'over5000', label: 'Over AED 5,000' }
  ];

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        switch (priceRange) {
          case 'under500':
            return product.price < 500;
          case '500to2000':
            return product.price >= 500 && product.price <= 2000;
          case '2000to5000':
            return product.price > 2000 && product.price <= 5000;
          case 'over5000':
            return product.price > 5000;
          default:
            return true;
        }
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy, priceRange]);

  const ProductCard = ({ product, index }) => {
    return (
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 hover:scale-105"
        style={{
          animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
        }}
      >
        <div className="relative overflow-hidden">
          <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-48 group-hover:from-yellow-50 group-hover:to-yellow-100 transition-all duration-300">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-300"></div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-left leading-tight group-hover:text-yellow-600 transition-colors duration-300">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
              {product.priceDisplay}
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded transition-all duration-300 ${
              product.availability === 'In Stock' 
                ? 'text-green-700 bg-green-100 group-hover:bg-green-200' 
                : product.availability === 'Service Available' || product.availability === 'Book Now'
                ? 'text-blue-700 bg-blue-100 group-hover:bg-blue-200'
                : 'text-orange-700 bg-orange-100 group-hover:bg-orange-200'
            }`}>
              {product.availability}
            </span>
          </div>
          
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95">
            <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-medium">
              {product.category === 'Services' ? 'Book Service' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 animate-pulse" style={{animation: 'slideInLeft 0.8s ease-out'}}>
                Products & Services
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative" style={{animation: 'fadeInUp 0.8s ease-out 0.2s both'}}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search crane parts & services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Sorting */}
        <div className="mb-6" style={{animation: 'fadeInUp 0.8s ease-out 0.4s both'}}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          <div className={`transition-all duration-500 overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Results: {filteredProducts.length} items</label>
                  <div className="text-sm text-gray-600 py-2">
                    Showing filtered results based on your selections
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6" style={{animation: 'fadeInUp 0.8s ease-out 0.6s both'}}>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={{
                animation: `bounceIn 0.6s ease-out ${index * 0.1 + 0.8}s both`
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12" style={{animation: 'fadeInUp 0.8s ease-out'}}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12" style={{animation: 'fadeInUp 0.8s ease-out 1s both'}}>
            <button className="px-8 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              Load More Parts & Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;