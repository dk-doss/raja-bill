import React, { useState } from 'react';
import { Store, Phone, MapPin, Clock, Save, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { updateStoreInfo, resetDatabase } from '../../api';

export function StoreSettings() {
  const { storeInfo, setStoreInfo } = useStore();
  const [formData, setFormData] = useState({ ...storeInfo });
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateStoreInfo(formData);
      setStoreInfo(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update store settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset all products, categories and sample orders back to initial defaults?')) {
      return;
    }
    setIsResetting(true);
    try {
      await resetDatabase();
      alert('Demo data restored successfully! Refreshing...');
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Failed to reset database');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Store Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Store Profile & Pickup Settings</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure how RAJA STORE appears to your customers on the Ordering App.
          </p>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <span>✅</span>
            <span>Store settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Store Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Store Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-sm focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Store Tagline / Subtitle</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Shop Address & Pickup Counter Location *</label>
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number for Customer Calls *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:border-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:border-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Timings & Prep Estimate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Operating Hours</label>
              <input
                type="text"
                value={formData.pickupTimings}
                onChange={(e) => setFormData({ ...formData, pickupTimings: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:border-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Preparation Time</label>
              <input
                type="text"
                value={formData.prepEstimate}
                onChange={(e) => setFormData({ ...formData, prepEstimate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:border-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Store Open / Closed Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded-md focus:ring-emerald-500 border-slate-300"
              />
              <div>
                <span className="font-extrabold text-slate-900 text-sm">Store Accepting Customer Orders</span>
                <p className="text-[11px] text-slate-500">
                  Uncheck this if the shop is currently closed or not taking new online pickup orders.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5" />
          <h4 className="font-black text-sm text-slate-900">Reset Demo Database</h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Need to test the store from scratch? This will restore all default groceries, categories, and initial sample orders.
        </p>
        <div>
          <button
            type="button"
            disabled={isResetting}
            onClick={handleResetData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset to Default Sample Data'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
