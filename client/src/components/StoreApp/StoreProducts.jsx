import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Edit2, Trash2, Check, X, AlertCircle, 
  ArrowUpDown, RefreshCw, Upload, Image as ImageIcon, Sparkles 
} from 'lucide-react';
import { fetchProducts, fetchCategories, createProduct, updateProduct, updateProductStock, deleteProduct, uploadImage } from '../../api';

const PRESET_GROCERY_IMAGES = [
  { label: 'Atta / Flour', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' },
  { label: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=500&q=80' },
  { label: 'Cooking Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80' },
  { label: 'Lentils / Dal', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80' },
  { label: 'Biscuits / Cookies', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80' },
  { label: 'Instant Noodles', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80' },
  { label: 'Tea Powder', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80' },
  { label: 'Coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80' },
  { label: 'Soap Bar', url: 'https://images.unsplash.com/photo-1607006314187-54cf0cefe5f8?auto=format&fit=crop&w=500&q=80' },
  { label: 'Detergent', url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80' },
  { label: 'Butter / Dairy', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80' },
  { label: 'Fresh Milk', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80' },
  { label: 'Notebook / Pen', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80' }
];

export function StoreProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'inStock' | 'lowStock' | 'outOfStock'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryId: '',
    packSize: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    isActive: true
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts({ admin: true }),
        fetchCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      categoryId: categories[0]?.id || '',
      packSize: '1 unit',
      price: '',
      stock: '20',
      image: PRESET_GROCERY_IMAGES[0].url,
      description: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      categoryId: product.categoryId,
      packSize: product.packSize || '',
      price: product.price,
      stock: product.stock,
      image: product.image,
      description: product.description || '',
      isActive: product.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleQuickStockUpdate = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await updateProductStock(productId, newStock);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    } catch (err) {
      alert(err.message || 'Error updating stock');
    }
  };

  const handleToggleStock = async (product) => {
    const newStock = product.stock > 0 ? 0 : 20;
    try {
      await updateProductStock(product.id, newStock);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
    } catch (err) {
      alert(err.message || 'Error updating stock');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting product');
    }
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, formData);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const created = await createProduct(formData);
        setProducts(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const cat = categories.find(c => c.id === p.categoryId);
    const catName = cat ? cat.name.toLowerCase() : '';
    const q = searchQuery.toLowerCase().trim();

    let matchesSearch = true;
    if (q) {
      matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        catName.includes(q);
    }

    let matchesStock = true;
    if (stockFilter === 'inStock') matchesStock = p.stock > 5;
    else if (stockFilter === 'lowStock') matchesStock = p.stock > 0 && p.stock <= 5;
    else if (stockFilter === 'outOfStock') matchesStock = p.stock === 0;

    return matchesCat && matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Search, Filters, Add Button */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-orange-500"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden"
            >
              <option value="all">All Stock Statuses</option>
              <option value="inStock">In Stock (&gt;5)</option>
              <option value="lowStock">Low Stock (1-5)</option>
              <option value="outOfStock">Out of Stock (0)</option>
            </select>
          </div>

          <div className="text-slate-400 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pack Size</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((p) => {
                const cat = categories.find(c => c.id === p.categoryId);
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 5;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Image & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-0.5 border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{p.name}</div>
                          {p.brand && <div className="text-[10px] text-slate-500 font-semibold">{p.brand}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        <span>{cat?.icon || '📦'}</span>
                        <span>{cat?.name || 'General'}</span>
                      </span>
                    </td>

                    {/* Pack Size */}
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {p.packSize}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-black text-slate-900 text-sm">
                      ₹{p.price}
                    </td>

                    {/* Stock Level & Quick Adjust */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, p.stock, -1)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center cursor-pointer shadow-2xs"
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <span className={`w-8 text-center font-black ${
                            isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800'
                          }`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, p.stock, 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center cursor-pointer shadow-2xs"
                            title="Increase stock by 1"
                          >
                            +
                          </button>
                        </div>

                        {/* In/Out toggle */}
                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase transition-colors cursor-pointer ${
                            isOut
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : 'In Stock'}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product to RAJA STORE'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aashirvaad Superior MP Atta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Brand & Pack Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aashirvaad"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pack Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 kg, 500 ml"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Category, Price, Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 font-semibold focus:border-orange-500 focus:outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="320"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock (Units) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Image URL & Preset Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Product Image URL</span>
                  <span className="text-[11px] text-slate-400 font-normal">or select quick preset below</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Quick Preset Selector */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PRESET_GROCERY_IMAGES.slice(0, 8).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className="text-[10px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 px-2 py-0.5 rounded-md font-semibold transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Short description or benefits of this product..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Submit / Cancel */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-black hover:bg-orange-700 shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
