import React from 'react';
import { ShoppingBag, Search, Store, Clock, Phone, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export function Navbar({ onOpenCart, onOpenTracker, currentView, setCurrentView }) {
  const { itemCount, totalAmount } = useCart();
  const { storeInfo, isStaffLoggedIn, activeTrackingId } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wide">
        <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">Self-Pickup Only</span>
        <span>Order from home & collect at RAJA STORE counter — No delivery wait!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Store Info */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setCurrentView('customer')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  {storeInfo.name || 'RAJA STORE'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {storeInfo.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-slate-400" />
                {storeInfo.address}
              </p>
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Order Tracker Button */}
            <button
              onClick={onOpenTracker}
              className={`relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all border ${
                activeTrackingId
                  ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs hover:bg-amber-100'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Check status of your order"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Track Order</span>
              <span className="sm:hidden">Track</span>
              {activeTrackingId && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {totalAmount > 0 && (
                <span className="bg-emerald-700/80 px-2 py-0.5 rounded-lg text-xs font-black">
                  ₹{totalAmount}
                </span>
              )}
            </button>

            {/* Store Portal Toggle */}
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'customer' : 'store')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border ${
                currentView === 'store'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Shop Owner & Staff App"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">
                {currentView === 'store' ? 'Store Front' : 'Store Staff App'}
              </span>
              <span className="md:hidden">
                {currentView === 'store' ? 'Shop' : 'Staff'}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
