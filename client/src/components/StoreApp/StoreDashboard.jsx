import React, { useState, useEffect } from 'react';
import { 
  Store, ClipboardList, Package, Tag, Settings, LogOut, Bell, BellOff, 
  ExternalLink, TrendingUp, Clock, CheckCircle2, AlertCircle, ShoppingBag, 
  DollarSign, Sparkles, Volume2, VolumeX, Eye, Globe
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchOrderStats, subscribeToEvents } from '../../api';
import { StoreOrders } from './StoreOrders';
import { StoreProducts } from './StoreProducts';
import { StoreCategories } from './StoreCategories';
import { StoreSettings } from './StoreSettings';

export function StoreDashboard({ onSwitchToCustomer }) {
  const { 
    storeInfo, 
    logoutStaffSession, 
    soundEnabled, 
    setSoundEnabled, 
    newOrderAlert, 
    setNewOrderAlert 
  } = useStore();
  const { lang, toggleLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'categories' | 'settings'
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrdersCount: 0,
    todayRevenue: 0,
    pendingAction: 0,
    received: 0,
    accepted: 0,
    preparing: 0,
    readyForCollection: 0,
    collected: 0,
    cancelled: 0,
    activeOrdersCount: 0
  });

  useEffect(() => {
    loadStats();

    // Subscribe to SSE
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'new_order' || event.type === 'order_status_updated') {
        loadStats();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchOrderStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-md shadow-orange-600/30">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight">
                    {lang === 'ta' ? 'ராஜா ஸ்டோர்' : (storeInfo.name || 'RAJA STORE')}
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-orange-500/30">
                    {t('staff')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  {t('staffPortal')}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-300 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                title="Switch Language / மொழியை மாற்றுக"
              >
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              {/* Sound Alert Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
                title={soundEnabled ? 'Order sound alert ON' : 'Order sound alert OFF'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden md:inline">{soundEnabled ? t('soundOn') : t('soundMuted')}</span>
              </button>

              {/* View Customer App */}
              <button
                onClick={onSwitchToCustomer}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t('customerStorefront')}
              >
                <Eye className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">{t('customerStorefront')}</span>
              </button>

              {/* Logout */}
              <button
                onClick={logoutStaffSession}
                className="p-2 sm:px-3 sm:py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Floating Incoming Order Notification Banner */}
      {newOrderAlert && (
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white p-4 shadow-xl animate-bounce">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  {lang === 'ta' ? 'புதிய ஆர்டர் வந்துள்ளது' : 'NEW ORDER RECEIVED'}: {newOrderAlert.orderDisplayNumber}
                </h4>
                <p className="text-xs text-white/90 font-medium">
                  {newOrderAlert.customerName} ({newOrderAlert.phone}) • {lang === 'ta' ? 'மொத்தம்' : 'Total'}: ₹{newOrderAlert.totalAmount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('orders'); setNewOrderAlert(null); }}
                className="px-3.5 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-extrabold hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
              >
                {lang === 'ta' ? 'ஆர்டர்களில் பார்க்க' : 'View in Orders'}
              </button>
              <button
                onClick={() => setNewOrderAlert(null)}
                className="p-1.5 text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* New Orders */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 uppercase">{t('newOrdersBadge')}</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
              {stats.received}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{t('needAcceptance')}</p>
          </div>

          {/* In Preparation */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="text-[11px] font-bold text-blue-700 uppercase">{t('PREPARING')}</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {stats.accepted + stats.preparing}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{t('staffPacking')}</p>
          </div>

          {/* Ready for Collection */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="text-[11px] font-bold text-emerald-700 uppercase">{t('readyCount')}</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {stats.readyForCollection}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{t('onPickupCounter')}</p>
          </div>

          {/* Collected Today */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="text-[11px] font-bold text-slate-600 uppercase">{t('collectedToday')}</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              {stats.collected}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{t('completed')}</p>
          </div>

          {/* Active Orders */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="text-[11px] font-bold text-amber-700 uppercase">{t('activeTotal')}</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {stats.activeOrdersCount}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{t('inPipeline')}</p>
          </div>

          {/* Today's Sales */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-600 uppercase">{t('collectedRevenue')}</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              ₹{stats.todayRevenue}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{t('storeRevenue')}</p>
          </div>

        </div>

        {/* Tab Navigation Navigation */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none">
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>{t('tabOrders')}</span>
            {stats.received > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {stats.received}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('tabProducts')}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>{t('tabCategories')}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t('tabSettings')}</span>
          </button>

        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'orders' && <StoreOrders />}
          {activeTab === 'products' && <StoreProducts />}
          {activeTab === 'categories' && <StoreCategories />}
          {activeTab === 'settings' && <StoreSettings />}
        </div>

      </div>

    </div>
  );
}
