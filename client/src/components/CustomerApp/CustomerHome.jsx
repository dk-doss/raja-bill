import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Check, Package, Sparkles, AlertCircle, ShoppingBag, Store, Clock, ChevronRight, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { fetchCategories, fetchProducts } from '../../api';

export function CustomerHome({ onOpenCart, onOpenTracker }) {
  const { addToCart, updateQuantity, getItemQuantity, itemCount, totalAmount } = useCart();
  const { storeInfo } = useStore();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load categories and products
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products by selected category and search
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const cat = categories.find(c => c.id === p.categoryId);
    const catName = cat ? cat.name.toLowerCase() : '';
    const q = searchQuery.toLowerCase().trim();

    if (!q) return matchesCategory;

    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      catName.includes(q) ||
      (p.description && p.description.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      
      {/* Hero Welcome Section */}
      <section className="bg-gradient-to-b from-orange-50 via-amber-50/50 to-transparent border-b border-orange-100/60 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-4 tracking-wide border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Digital Storefront for {storeInfo.name || 'RAJA STORE'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">{storeInfo.name || 'RAJA STORE'}</span>
          </h1>

          <p className="mt-3 text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
            Shop from your home. Order now and collect from our shop.
          </p>

          {/* Quick Value Props Banner */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700 bg-white/90 backdrop-blur-xs py-2 px-4 sm:px-6 rounded-2xl shadow-xs border border-orange-100">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Fast Packing ({storeInfo.prepEstimate || '15 mins'})</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-amber-700">
              <Store className="w-4 h-4 text-amber-600" />
              <span>Counter Collection Point</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-orange-700">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Timings: {storeInfo.pickupTimings}</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-7 max-w-2xl mx-auto relative">
            <div className="relative flex items-center shadow-lg shadow-orange-950/5 rounded-2xl bg-white border-2 border-orange-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search products, brands, or categories (e.g. Atta, Rice, Surf, Maggi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3.5 px-3 text-slate-800 placeholder-slate-400 focus:outline-hidden text-sm sm:text-base font-medium bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-slate-400 hover:text-slate-600 mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Dynamic Categories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Categories</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {categories.length}
              </span>
            </h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Categories Horizontal Scroll / Wrap */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 ring-2 ring-orange-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <span>🛒</span>
              <span>All Products</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                selectedCategory === 'all' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {products.length}
              </span>
            </button>

            {categories.map((cat) => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 ring-2 ring-orange-600/20'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <span>{cat.icon || '📦'}</span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product List Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {selectedCategory === 'all'
                ? 'All Available Products'
                : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              ({filteredProducts.length} items found)
            </span>
          </div>

          {searchQuery && (
            <div className="text-xs text-slate-500 font-medium">
              Searching for "<span className="text-orange-600 font-bold">{searchQuery}</span>"
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="w-full h-36 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">No products found</h4>
            <p className="text-sm text-slate-500 mb-6">
              We couldn't find any products matching your search or category selection.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => {
              const qtyInCart = getItemQuantity(product.id);
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= 5;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:shadow-lg ${
                    isOutOfStock
                      ? 'border-slate-200 opacity-80'
                      : 'border-slate-200/90 hover:border-orange-300'
                  }`}
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80';
                      }}
                      className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${
                        isOutOfStock ? 'grayscale' : ''
                      }`}
                    />

                    {/* Stock Badges */}
                    {isOutOfStock ? (
                      <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                        OUT OF STOCK
                      </span>
                    ) : isLowStock ? (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        Only {product.stock} left
                      </span>
                    ) : null}

                    {/* Brand Pill */}
                    {product.brand && (
                      <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 sm:p-4 flex flex-col grow justify-between">
                    <div>
                      {/* Name */}
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h4>

                      {/* Pack Size */}
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        {product.packSize}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* Selling Price */}
                      <div>
                        <div className="text-base sm:text-lg font-black text-slate-900">
                          ₹{product.price}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Incl. taxes
                        </div>
                      </div>

                      {/* Action Button: ADD or Quantity Selector */}
                      <div className="shrink-0">
                        {isOutOfStock ? (
                          <button
                            disabled
                            className="bg-slate-100 text-slate-400 text-xs font-bold px-3 py-2 rounded-xl cursor-not-allowed uppercase"
                          >
                            OUT OF STOCK
                          </button>
                        ) : qtyInCart > 0 ? (
                          <div className="flex items-center gap-1.5 bg-orange-600 text-white rounded-xl p-1 shadow-sm shadow-orange-600/30">
                            <button
                              onClick={() => updateQuantity(product.id, qtyInCart - 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center bg-orange-700/60 hover:bg-orange-800 active:scale-95 transition-all cursor-pointer font-black"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <span className="w-6 text-center text-xs font-extrabold select-none">
                              {qtyInCart}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, qtyInCart + 1)}
                              disabled={qtyInCart >= product.stock}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer font-black ${
                                qtyInCart >= product.stock
                                  ? 'bg-orange-400/50 opacity-60 cursor-not-allowed'
                                  : 'bg-orange-700/60 hover:bg-orange-800 active:scale-95'
                              }`}
                              title={qtyInCart >= product.stock ? 'Maximum stock reached' : 'Increase quantity'}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-150 active:scale-95 flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>ADD</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How Self-Pickup Works Explainer Box */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="bg-orange-500/20 text-orange-400 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-orange-500/30">
              Simple 4-Step Pickup Flow
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-2">
              How Ordering at RAJA STORE Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Save time and avoid waiting in store queues. Order from home, we pack your items, and you collect!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h5 className="font-bold text-sm text-white">Select Products</h5>
              <p className="text-xs text-slate-400 mt-1">
                Browse groceries, snacks, household essentials and add items to your cart.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h5 className="font-bold text-sm text-white">Enter Name & Phone</h5>
              <p className="text-xs text-slate-400 mt-1">
                Enter your name and mobile number. No delivery address needed!
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h5 className="font-bold text-sm text-white">We Pack Your Order</h5>
              <p className="text-xs text-slate-400 mt-1">
                Our shop staff receives your order, packs everything, and marks it "READY".
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h5 className="font-bold text-sm text-white">Collect from Store</h5>
              <p className="text-xs text-slate-400 mt-1">
                Come to RAJA STORE counter, give your Order #, pay and collect your bag.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Bottom Cart Bar for Mobile */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 sm:hidden">
          <button
            onClick={onOpenCart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-between font-bold"
          >
            <div className="flex items-center gap-2">
              <span className="bg-emerald-800 px-2 py-0.5 rounded-lg text-xs font-black">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-sm">View Cart</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold">₹{totalAmount}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

    </div>
  );
}
