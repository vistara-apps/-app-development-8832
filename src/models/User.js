/**
 * User data model for Study & Style application
 */

export class User {
  constructor(data = {}) {
    this.userId = data.userId || null;
    this.farcasterId = data.farcasterId || null;
    this.walletAddress = data.walletAddress || null;
    this.stylePreferences = data.stylePreferences || {
      occasions: [],
      styles: [],
      colors: [],
      budgetRange: { min: 0, max: 200 }
    };
    this.budgetRange = data.budgetRange || { min: 0, max: 200 };
    this.savedLooks = data.savedLooks || [];
    this.wardrobeItemsIds = data.wardrobeItemsIds || [];
    this.notificationsEnabled = data.notificationsEnabled !== undefined ? data.notificationsEnabled : true;
    this.premiumFeatures = data.premiumFeatures || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastActive = data.lastActive || new Date().toISOString();
    this.onboardingCompleted = data.onboardingCompleted || false;
  }

  // Convert to plain object for storage
  toJSON() {
    return {
      userId: this.userId,
      farcasterId: this.farcasterId,
      walletAddress: this.walletAddress,
      stylePreferences: this.stylePreferences,
      budgetRange: this.budgetRange,
      savedLooks: this.savedLooks,
      wardrobeItemsIds: this.wardrobeItemsIds,
      notificationsEnabled: this.notificationsEnabled,
      premiumFeatures: this.premiumFeatures,
      createdAt: this.createdAt,
      lastActive: this.lastActive,
      onboardingCompleted: this.onboardingCompleted
    };
  }

  // Create from stored data
  static fromJSON(data) {
    return new User(data);
  }

  // Update last active timestamp
  updateLastActive() {
    this.lastActive = new Date().toISOString();
  }

  // Add wardrobe item
  addWardrobeItem(itemId) {
    if (!this.wardrobeItemsIds.includes(itemId)) {
      this.wardrobeItemsIds.push(itemId);
    }
  }

  // Remove wardrobe item
  removeWardrobeItem(itemId) {
    this.wardrobeItemsIds = this.wardrobeItemsIds.filter(id => id !== itemId);
  }

  // Add saved look
  addSavedLook(look) {
    const existingIndex = this.savedLooks.findIndex(l => l.id === look.id);
    if (existingIndex === -1) {
      this.savedLooks.push({
        ...look,
        savedAt: new Date().toISOString()
      });
    }
  }

  // Remove saved look
  removeSavedLook(lookId) {
    this.savedLooks = this.savedLooks.filter(look => look.id !== lookId);
  }

  // Update style preferences
  updateStylePreferences(preferences) {
    this.stylePreferences = { ...this.stylePreferences, ...preferences };
  }

  // Check if user has premium feature
  hasPremiumFeature(feature) {
    return this.premiumFeatures.includes(feature);
  }

  // Add premium feature
  addPremiumFeature(feature) {
    if (!this.premiumFeatures.includes(feature)) {
      this.premiumFeatures.push(feature);
    }
  }

  // Validate user data
  validate() {
    const errors = [];
    
    if (!this.walletAddress) {
      errors.push('Wallet address is required');
    }
    
    if (this.budgetRange.min < 0 || this.budgetRange.max < this.budgetRange.min) {
      errors.push('Invalid budget range');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default User;
