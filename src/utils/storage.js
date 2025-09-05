/**
 * Storage utilities for Study & Style application
 * Handles localStorage operations with error handling and data validation
 */

import User from '../models/User.js';
import WardrobeItem from '../models/WardrobeItem.js';

// Storage keys
const STORAGE_KEYS = {
  USER: 'studyStyle_user',
  WARDROBE_ITEMS: 'studyStyle_wardrobeItems',
  AI_SUGGESTIONS: 'studyStyle_aiSuggestions',
  LOOKBOOKS: 'studyStyle_lookbooks',
  PAYMENT_HISTORY: 'studyStyle_paymentHistory',
  APP_SETTINGS: 'studyStyle_appSettings'
};

// Storage version for migration handling
const STORAGE_VERSION = '1.0.0';

class StorageManager {
  constructor() {
    this.isAvailable = this.checkStorageAvailability();
    this.initializeStorage();
  }

  // Check if localStorage is available
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  // Initialize storage with version check
  initializeStorage() {
    if (!this.isAvailable) return;

    const currentVersion = localStorage.getItem('studyStyle_version');
    if (!currentVersion || currentVersion !== STORAGE_VERSION) {
      this.migrateStorage(currentVersion, STORAGE_VERSION);
      localStorage.setItem('studyStyle_version', STORAGE_VERSION);
    }
  }

  // Handle storage migration
  migrateStorage(fromVersion, toVersion) {
    console.log(`Migrating storage from ${fromVersion || 'unknown'} to ${toVersion}`);
    // Add migration logic here when needed
  }

  // Generic storage operations
  setItem(key, value) {
    if (!this.isAvailable) {
      console.warn('Storage not available');
      return false;
    }

    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: new Date().toISOString(),
        version: STORAGE_VERSION
      });
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      return parsed.data || defaultValue;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  }

  // User operations
  saveUser(user) {
    if (!(user instanceof User)) {
      throw new Error('Invalid user object');
    }

    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(`User validation failed: ${validation.errors.join(', ')}`);
    }

    return this.setItem(STORAGE_KEYS.USER, user.toJSON());
  }

  getUser() {
    const userData = this.getItem(STORAGE_KEYS.USER);
    return userData ? User.fromJSON(userData) : null;
  }

  removeUser() {
    return this.removeItem(STORAGE_KEYS.USER);
  }

  // Wardrobe operations
  saveWardrobeItems(items) {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }

    const validatedItems = items.map(item => {
      if (!(item instanceof WardrobeItem)) {
        throw new Error('Invalid wardrobe item object');
      }
      
      const validation = item.validate();
      if (!validation.isValid) {
        throw new Error(`Item validation failed: ${validation.errors.join(', ')}`);
      }
      
      return item.toJSON();
    });

    return this.setItem(STORAGE_KEYS.WARDROBE_ITEMS, validatedItems);
  }

  getWardrobeItems() {
    const itemsData = this.getItem(STORAGE_KEYS.WARDROBE_ITEMS, []);
    return itemsData.map(itemData => WardrobeItem.fromJSON(itemData));
  }

  addWardrobeItem(item) {
    const items = this.getWardrobeItems();
    items.push(item);
    return this.saveWardrobeItems(items);
  }

  updateWardrobeItem(itemId, updates) {
    const items = this.getWardrobeItems();
    const itemIndex = items.findIndex(item => item.itemId === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    items[itemIndex].update(updates);
    return this.saveWardrobeItems(items);
  }

  removeWardrobeItem(itemId) {
    const items = this.getWardrobeItems();
    const filteredItems = items.filter(item => item.itemId !== itemId);
    return this.saveWardrobeItems(filteredItems);
  }

  // AI suggestions operations
  saveAISuggestions(suggestions) {
    return this.setItem(STORAGE_KEYS.AI_SUGGESTIONS, suggestions);
  }

  getAISuggestions() {
    return this.getItem(STORAGE_KEYS.AI_SUGGESTIONS, []);
  }

  addAISuggestion(suggestion) {
    const suggestions = this.getAISuggestions();
    suggestions.unshift({
      ...suggestion,
      id: suggestion.id || Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 suggestions
    const trimmedSuggestions = suggestions.slice(0, 50);
    return this.saveAISuggestions(trimmedSuggestions);
  }

  // Lookbooks operations
  saveLookbooks(lookbooks) {
    return this.setItem(STORAGE_KEYS.LOOKBOOKS, lookbooks);
  }

  getLookbooks() {
    return this.getItem(STORAGE_KEYS.LOOKBOOKS, []);
  }

  // Payment history operations
  savePaymentHistory(payments) {
    return this.setItem(STORAGE_KEYS.PAYMENT_HISTORY, payments);
  }

  getPaymentHistory() {
    return this.getItem(STORAGE_KEYS.PAYMENT_HISTORY, []);
  }

  addPayment(payment) {
    const payments = this.getPaymentHistory();
    payments.unshift({
      ...payment,
      id: payment.id || Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    return this.savePaymentHistory(payments);
  }

  // App settings operations
  saveAppSettings(settings) {
    return this.setItem(STORAGE_KEYS.APP_SETTINGS, settings);
  }

  getAppSettings() {
    return this.getItem(STORAGE_KEYS.APP_SETTINGS, {
      theme: 'light',
      notifications: true,
      autoSave: true,
      language: 'en'
    });
  }

  updateAppSettings(updates) {
    const currentSettings = this.getAppSettings();
    const newSettings = { ...currentSettings, ...updates };
    return this.saveAppSettings(newSettings);
  }

  // Utility methods
  clearAllData() {
    if (!this.isAvailable) return false;

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      localStorage.removeItem('studyStyle_version');
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  getStorageSize() {
    if (!this.isAvailable) return 0;

    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });
    return totalSize;
  }

  exportData() {
    if (!this.isAvailable) return null;

    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      data[name] = this.getItem(key);
    });

    return {
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      data
    };
  }

  importData(exportedData) {
    if (!exportedData || !exportedData.data) {
      throw new Error('Invalid export data');
    }

    try {
      Object.entries(exportedData.data).forEach(([name, value]) => {
        if (STORAGE_KEYS[name] && value !== null) {
          this.setItem(STORAGE_KEYS[name], value);
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create singleton instance
const storage = new StorageManager();

export default storage;
export { STORAGE_KEYS, StorageManager };
