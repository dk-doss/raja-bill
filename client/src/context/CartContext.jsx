import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/audio';

const CartContext = createContext();

const CART_STORAGE_KEY = 'raja_store_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product, qty = 1) => {
    if (product.stock <= 0) {
      showNotification(`${product.name} is currently Out of Stock!`, 'error');
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + qty;

        if (newQty > product.stock) {
          showNotification(`Maximum available stock is ${product.stock} units for ${product.name}`, 'warning');
          return prev;
        }

        sound.playClick();
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], quantity: newQty };
        return copy;
      } else {
        if (qty > product.stock) {
          showNotification(`Only ${product.stock} units available for ${product.name}`, 'warning');
          return prev;
        }
        sound.playClick();
        return [...prev, { product, quantity: qty }];
      }
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          if (newQty > item.product.stock) {
            showNotification(`Cannot exceed available stock (${item.product.stock})`, 'warning');
            return item;
          }
          sound.playClick();
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    sound.playClick();
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        itemCount,
        totalAmount,
        notification,
        showNotification
      }}
    >
      {children}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 border transition-all animate-bounce ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{notification.type === 'error' ? '⚠️' : notification.type === 'warning' ? '🔔' : '✅'}</span>
          <span>{notification.msg}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
