import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Store, Clock, Phone, CheckCircle2, ShieldCheck, MapPin, Globe, Smartphone, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export function Navbar({ onOpenCart, onOpenTracker, currentView, setCurrentView }) {
  const { itemCount, totalAmount } = useCart();
  const { storeInfo, isStaffLoggedIn, activeTrackingId, trackOrder } = useStore();
  const { lang, toggleLanguage, t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for iOS or desktop
      alert(
        lang === 'ta'
          ? '📱 மொபைல் செயலியை நிறுவ:\n- Android Chrome: திரையின் மேல் உள்ள மூன்று புள்ளிகளை (⋮) தொட்டு "Install app" அல்லது "Add to Home screen" அழுத்தவும்.\n- iPhone Safari: கீழே உள்ள Share (⬆️) ஐகானை தொட்டு "Add to Home Screen" அழுத்தவும்.'
          : '📱 To install the RAJA STORE App:\n- On Android Chrome: Tap Menu (⋮) and select "Install app" or "Add to Home screen".\n- On iPhone Safari: Tap Share (⬆️) and select "Add to Home Screen".'
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wide">
        <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">
          {t('selfPickupBadge')}
        </span>
        <span className="truncate max-w-md sm:max-w-none">
          {t('pickupOnlyNotice')}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-2 sm:gap-4">
          
          {/* Logo & Store Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" onClick={() => setCurrentView('customer')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
              <Store className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900">
                  {lang === 'ta' ? 'ராஜா ஸ்டோர்' : (storeInfo.name || 'RAJA STORE')}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {storeInfo.isOpen ? t('openNow') : t('closed')}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1 font-medium truncate max-w-xs">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {storeInfo.address}
              </p>
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Install App Button */}
            {!isAppInstalled && (
              <button
                onClick={handleInstallClick}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-sm cursor-pointer"
                title="Install RAJA STORE App on your phone or desktop"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {lang === 'ta' ? 'செயலியை நிறுவுக' : 'Install App'}
                </span>
                <span className="md:hidden">
                  {lang === 'ta' ? 'App' : 'App'}
                </span>
              </button>
            )}

            {/* Language Switcher Button (English / தமிழ்) */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100 cursor-pointer shadow-2xs"
              title="Change Language / மொழியை மாற்றுக"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="tracking-wide">
                {lang === 'en' ? 'தமிழ்' : 'English'}
              </span>
            </button>

            {/* Order Tracker Button */}
            <div className="relative flex items-center">
              <button
                onClick={onOpenTracker}
                className={`relative px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all border ${
                  activeTrackingId
                    ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs hover:bg-amber-100 pr-6.5 sm:pr-7'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title={t('trackOrder')}
              >
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                <span className="hidden sm:inline">{t('trackOrder')}</span>
                {activeTrackingId && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                )}
              </button>
              {activeTrackingId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    trackOrder(null);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-200/90 hover:bg-rose-500 hover:text-white text-amber-900 flex items-center justify-center text-[10px] font-black transition-colors cursor-pointer"
                  title="Turn off tracking indicator (✕) / கண்காணிப்பை நிறுத்து"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">{t('cart')}</span>
              {totalAmount > 0 && (
                <span className="bg-emerald-700/80 px-1.5 py-0.5 rounded-lg text-xs font-black">
                  ₹{totalAmount}
                </span>
              )}
            </button>

            {/* Store Portal Toggle */}
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'customer' : 'store')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border ${
                currentView === 'store'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title={t('storeStaffApp')}
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              <span className="hidden md:inline">
                {currentView === 'store' ? t('customerStorefront') : t('storeStaffApp')}
              </span>
              <span className="md:hidden">
                {currentView === 'store' ? t('shop') : t('staff')}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
