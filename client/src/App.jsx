import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { CustomerHome } from './components/CustomerApp/CustomerHome';
import { CartDrawer } from './components/CustomerApp/CartDrawer';
import { OrderTrackerModal } from './components/CustomerApp/OrderTrackerModal';
import { StoreLogin } from './components/StoreApp/StoreLogin';
import { StoreDashboard } from './components/StoreApp/StoreDashboard';

function MainApp() {
  const { isStaffLoggedIn } = useStore();
  const [currentView, setCurrentView] = useState('customer'); // 'customer' | 'store'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);

  const handleOrderPlaced = (newOrder) => {
    setTrackedOrder(newOrder);
    setIsTrackerOpen(true);
  };

  const handleOpenTrackerWithOrder = (order = null) => {
    setTrackedOrder(order);
    setIsTrackerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* If in Store App view */}
      {currentView === 'store' ? (
        isStaffLoggedIn ? (
          <StoreDashboard onSwitchToCustomer={() => setCurrentView('customer')} />
        ) : (
          <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
            <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-lg">RAJA STORE Staff Portal</span>
              <button
                onClick={() => setCurrentView('customer')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                ← Back to Customer Storefront
              </button>
            </header>
            <StoreLogin
              onLoginSuccess={() => setCurrentView('store')}
              onCancel={() => setCurrentView('customer')}
            />
            <footer className="p-4 text-center text-xs text-slate-400">
              RAJA STORE Store Management System • Authorized Personnel Only
            </footer>
          </div>
        )
      ) : (
        /* Customer Storefront View */
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenTracker={() => handleOpenTrackerWithOrder(null)}
          />

          <main className="flex-1">
            <CustomerHome
              onOpenCart={() => setIsCartOpen(true)}
              onOpenTracker={() => handleOpenTrackerWithOrder(null)}
            />
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
            <p className="font-bold text-slate-700 text-sm">
              RAJA STORE — Neighborhood Retail Ordering System
            </p>
            <p>
              Order Groceries Online • Collect at RAJA STORE Counter • Free Self-Pickup
            </p>
            <p className="text-[11px] text-slate-400 pt-2">
              © {new Date().getFullYear()} RAJA STORE. All rights reserved.
            </p>
          </footer>

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onOrderPlaced={handleOrderPlaced}
          />

          {/* Order Tracker Modal */}
          <OrderTrackerModal
            isOpen={isTrackerOpen}
            onClose={() => setIsTrackerOpen(false)}
            initialOrder={trackedOrder}
          />
        </>
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </StoreProvider>
  );
}
