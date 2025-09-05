/**
 * Custom hook for localStorage operations with React state management
 */

import { useState, useEffect, useCallback } from 'react';
import storage from '../utils/storage.js';
import User from '../models/User.js';
import WardrobeItem from '../models/WardrobeItem.js';

// Generic localStorage hook
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    return storage.getItem(key, defaultValue);
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      storage.setItem(key, newValue);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [value, setStoredValue];
}

// User-specific hook
export function useUser() {
  const [user, setUser] = useState(() => storage.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveUser = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userInstance = userData instanceof User ? userData : new User(userData);
      const success = storage.saveUser(userInstance);
      
      if (success) {
        setUser(userInstance);
      } else {
        throw new Error('Failed to save user data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updates) => {
    if (!user) {
      setError('No user to update');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = new User({ ...user.toJSON(), ...updates });
      const success = storage.saveUser(updatedUser);
      
      if (success) {
        setUser(updatedUser);
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const removeUser = useCallback(() => {
    storage.removeUser();
    setUser(null);
    setError(null);
  }, []);

  const refreshUser = useCallback(() => {
    const storedUser = storage.getUser();
    setUser(storedUser);
  }, []);

  return {
    user,
    saveUser,
    updateUser,
    removeUser,
    refreshUser,
    isLoading,
    error
  };
}

// Wardrobe-specific hook
export function useWardrobe() {
  const [items, setItems] = useState(() => storage.getWardrobeItems());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addItem = useCallback(async (itemData) => {
    setIsLoading(true);
    setError(null);

    try {
      const item = itemData instanceof WardrobeItem ? itemData : new WardrobeItem(itemData);
      const success = storage.addWardrobeItem(item);
      
      if (success) {
        setItems(storage.getWardrobeItems());
      } else {
        throw new Error('Failed to add wardrobe item');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error adding wardrobe item:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemId, updates) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = storage.updateWardrobeItem(itemId, updates);
      
      if (success) {
        setItems(storage.getWardrobeItems());
      } else {
        throw new Error('Failed to update wardrobe item');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating wardrobe item:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = storage.removeWardrobeItem(itemId);
      
      if (success) {
        setItems(storage.getWardrobeItems());
      } else {
        throw new Error('Failed to remove wardrobe item');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error removing wardrobe item:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const wearItem = useCallback(async (itemId) => {
    const item = items.find(i => i.itemId === itemId);
    if (item) {
      item.wear();
      await updateItem(itemId, { 
        wearCount: item.wearCount, 
        lastWornDate: item.lastWornDate 
      });
    }
  }, [items, updateItem]);

  const refreshItems = useCallback(() => {
    setItems(storage.getWardrobeItems());
  }, []);

  const getItemsByCategory = useCallback((category) => {
    return items.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }, [items]);

  const getItemsByStatus = useCallback((status) => {
    return items.filter(item => item.getWearStatus() === status);
  }, [items]);

  const searchItems = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.brand.toLowerCase().includes(lowercaseQuery) ||
      item.color.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    wearItem,
    refreshItems,
    getItemsByCategory,
    getItemsByStatus,
    searchItems,
    isLoading,
    error
  };
}

// AI suggestions hook
export function useAISuggestions() {
  const [suggestions, setSuggestions] = useState(() => storage.getAISuggestions());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addSuggestion = useCallback((suggestion) => {
    try {
      storage.addAISuggestion(suggestion);
      setSuggestions(storage.getAISuggestions());
    } catch (err) {
      setError(err.message);
      console.error('Error adding AI suggestion:', err);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    storage.saveAISuggestions([]);
    setSuggestions([]);
  }, []);

  const refreshSuggestions = useCallback(() => {
    setSuggestions(storage.getAISuggestions());
  }, []);

  return {
    suggestions,
    addSuggestion,
    clearSuggestions,
    refreshSuggestions,
    isLoading,
    error
  };
}

// Payment history hook
export function usePaymentHistory() {
  const [payments, setPayments] = useState(() => storage.getPaymentHistory());

  const addPayment = useCallback((payment) => {
    storage.addPayment(payment);
    setPayments(storage.getPaymentHistory());
  }, []);

  const refreshPayments = useCallback(() => {
    setPayments(storage.getPaymentHistory());
  }, []);

  return {
    payments,
    addPayment,
    refreshPayments
  };
}

// App settings hook
export function useAppSettings() {
  const [settings, setSettings] = useState(() => storage.getAppSettings());

  const updateSettings = useCallback((updates) => {
    storage.updateAppSettings(updates);
    setSettings(storage.getAppSettings());
  }, []);

  const resetSettings = useCallback(() => {
    storage.saveAppSettings({
      theme: 'light',
      notifications: true,
      autoSave: true,
      language: 'en'
    });
    setSettings(storage.getAppSettings());
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings
  };
}

// Data management hook
export function useDataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);

  const exportData = useCallback(async () => {
    setIsExporting(true);
    setError(null);

    try {
      const data = storage.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `study-style-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      console.error('Error exporting data:', err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importData = useCallback(async (file) => {
    setIsImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const success = storage.importData(data);
      
      if (!success) {
        throw new Error('Failed to import data');
      }
      
      // Refresh the page to reload all data
      window.location.reload();
    } catch (err) {
      setError(err.message);
      console.error('Error importing data:', err);
    } finally {
      setIsImporting(false);
    }
  }, []);

  const clearAllData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      storage.clearAllData();
      window.location.reload();
    }
  }, []);

  const getStorageInfo = useCallback(() => {
    return {
      size: storage.getStorageSize(),
      isAvailable: storage.isAvailable
    };
  }, []);

  return {
    exportData,
    importData,
    clearAllData,
    getStorageInfo,
    isExporting,
    isImporting,
    error
  };
}

export default useLocalStorage;
