import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { productAPI } from '../utils/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';

const PRODUCTS_PER_PAGE = 8;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getProducts(),
          productAPI.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Optimized filtering with useMemo - only recalculates when dependencies change
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [selectedCategory, debouncedSearchTerm, products]);

  // Products to display (with infinite scroll)
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  const hasMore = displayCount < filteredProducts.length;

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(PRODUCTS_PER_PAGE);
  }, [selectedCategory, debouncedSearchTerm]);

  // Infinite scroll with Intersection Observer
  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);
        setIsLoadingMore(false);
      }, 300);
    }
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(`${product.title.substring(0, 30)}... added to cart!`, 'success');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Products</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 mt-1">Browse our collection of {products.length} products</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {filteredProducts.length !== products.length && (
        <p className="text-sm text-slate-500">
          Showing {displayedProducts.length} of {filteredProducts.length} products
          {filteredProducts.length !== products.length && ` (filtered from ${products.length})`}
        </p>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No products found</h3>
          <p className="text-slate-500">Try adjusting your search or filter</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square p-6 bg-slate-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-slate-800 line-clamp-2 min-h-[48px]">
                  {product.title}
                </h3>

                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating.rate)
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">
                    ({product.rating.count})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-slate-800">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-violet-500/25"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
          
          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="py-8">
            {isLoadingMore && (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                <span className="text-slate-500">Loading more products...</span>
              </div>
            )}
            {hasMore && !isLoadingMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 text-violet-600 hover:text-violet-700 font-medium"
                >
                  Load More ({filteredProducts.length - displayCount} remaining)
                </button>
              </div>
            )}
            {!hasMore && displayedProducts.length > PRODUCTS_PER_PAGE && (
              <p className="text-center text-slate-400 text-sm">
                You've reached the end! ({displayedProducts.length} products)
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
