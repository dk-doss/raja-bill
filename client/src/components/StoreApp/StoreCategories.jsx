import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, Check, X, Sparkles, FolderPlus } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, fetchProducts } from '../../api';

const EMOJI_PRESETS = ['🌾', '🍿', '☕', '🧼', '🧴', '🥛', '📝', '🍪', '🍫', '🧃', '🪥', '🧺', '🍚', '🥖', '🍎', '🥫', '📦'];

export function StoreCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    sortOrder: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts({ admin: true })
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      icon: '📦',
      sortOrder: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      icon: cat.icon || '📦',
      sortOrder: cat.sortOrder || 1
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id, name) => {
    const attachedCount = products.filter(p => p.categoryId === id).length;
    if (attachedCount > 0) {
      if (!window.confirm(`Warning: "${name}" currently has ${attachedCount} products attached to it. Delete anyway?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
        return;
      }
    }

    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting category');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCat) {
        const updated = await updateCategory(editingCat.id, formData);
        setCategories(prev => prev.map(c => c.id === editingCat.id ? updated : c));
      } else {
        const created = await createCategory(formData);
        setCategories(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Error saving category');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Add Button */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Category Management</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Categories configured here reflect immediately on the RAJA STORE Customer App.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-orange-200 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl shrink-0">
                  {cat.icon || '📦'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{cat.name}</h4>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    {productCount} {productCount === 1 ? 'product' : 'products'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-base">
                {editingCat ? 'Edit Category' : 'Create New Category'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              
              {/* Category Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frozen Foods, Fresh Bakery"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Icon Emoji */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Icon / Emoji</label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xl shrink-0">
                    {formData.icon || '📦'}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-16 px-2 py-2 rounded-xl border border-slate-300 text-center text-base font-bold focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Preset Emojis */}
                <div className="flex flex-wrap gap-1">
                  {EMOJI_PRESETS.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-orange-100 text-sm flex items-center justify-center transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Sort Order</label>
                <input
                  type="number"
                  min="1"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-black hover:bg-orange-700"
                >
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
