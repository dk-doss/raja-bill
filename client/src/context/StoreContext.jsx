import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStoreInfo, subscribeToEvents } from '../api';
import { sound } from '../utils/audio';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeInfo, setStoreInfo] = useState({
    name: 'RAJA STORE',
    tagline: 'Order from home • Collect at your convenience',
    phone: '+91 98765 43210',
    whatsapp: '+919876543210',
    address: 'Shop #4, Main Bazaar Road, Near Town Clock Tower',
    pickupTimings: '8:00 AM – 9:30 PM (Daily)',
    prepEstimate: '10–20 mins',
    isOpen: true,
    announcement: 'Fresh stock arrived! Place your order and pick up ready-packed groceries.'
  });

  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('raja_staff_token'));
  });

  const [activeTrackingId, setActiveTrackingId] = useState(() => {
    return localStorage.getItem('raja_active_tracking_order') || null;
  });

  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load store info on mount
  useEffect(() => {
    fetchStoreInfo()
      .then(setStoreInfo)
      .catch(err => console.error('Error fetching store info:', err));
  }, []);

  // Listen to SSE events
  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'store_info_updated') {
        setStoreInfo(event.data);
      } else if (event.type === 'new_order') {
        if (soundEnabled) {
          sound.playOrderAlert();
        }
        setNewOrderAlert(event.data);
      }
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const loginStaffSession = (token) => {
    localStorage.setItem('raja_staff_token', token);
    setIsStaffLoggedIn(true);
  };

  const logoutStaffSession = () => {
    localStorage.removeItem('raja_staff_token');
    setIsStaffLoggedIn(false);
  };

  const trackOrder = (orderIdentifier) => {
    if (orderIdentifier) {
      localStorage.setItem('raja_active_tracking_order', orderIdentifier);
      setActiveTrackingId(orderIdentifier);
    } else {
      localStorage.removeItem('raja_active_tracking_order');
      setActiveTrackingId(null);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        storeInfo,
        setStoreInfo,
        isStaffLoggedIn,
        loginStaffSession,
        logoutStaffSession,
        activeTrackingId,
        trackOrder,
        newOrderAlert,
        setNewOrderAlert,
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
