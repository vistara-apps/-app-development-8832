/**
 * WardrobeItem data model for Study & Style application
 */

export class WardrobeItem {
  constructor(data = {}) {
    this.itemId = data.itemId || this.generateId();
    this.userId = data.userId || null;
    this.name = data.name || '';
    this.imageUrl = data.imageUrl || null;
    this.category = data.category || '';
    this.subcategory = data.subcategory || '';
    this.color = data.color || '';
    this.brand = data.brand || '';
    this.size = data.size || '';
    this.price = data.price || null;
    this.purchaseDate = data.purchaseDate || null;
    this.wearCount = data.wearCount || 0;
    this.lastWornDate = data.lastWornDate || null;
    this.tags = data.tags || [];
    this.season = data.season || [];
    this.occasion = data.occasion || [];
    this.condition = data.condition || 'excellent';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Generate unique ID
  generateId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Convert to plain object for storage
  toJSON() {
    return {
      itemId: this.itemId,
      userId: this.userId,
      name: this.name,
      imageUrl: this.imageUrl,
      category: this.category,
      subcategory: this.subcategory,
      color: this.color,
      brand: this.brand,
      size: this.size,
      price: this.price,
      purchaseDate: this.purchaseDate,
      wearCount: this.wearCount,
      lastWornDate: this.lastWornDate,
      tags: this.tags,
      season: this.season,
      occasion: this.occasion,
      condition: this.condition,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from stored data
  static fromJSON(data) {
    return new WardrobeItem(data);
  }

  // Update item
  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'itemId' && key !== 'createdAt' && this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }

  // Increment wear count
  wear() {
    this.wearCount += 1;
    this.lastWornDate = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Add tag
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date().toISOString();
    }
  }

  // Remove tag
  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date().toISOString();
  }

  // Get wear frequency status
  getWearStatus() {
    if (this.wearCount === 0) return 'unworn';
    if (this.wearCount < 3) return 'rarely-worn';
    if (this.wearCount < 10) return 'moderate';
    return 'frequently-worn';
  }

  // Get days since last worn
  getDaysSinceLastWorn() {
    if (!this.lastWornDate) return null;
    const lastWorn = new Date(this.lastWornDate);
    const now = new Date();
    const diffTime = Math.abs(now - lastWorn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if suitable for season
  isSuitableForSeason(season) {
    return this.season.length === 0 || this.season.includes(season);
  }

  // Check if suitable for occasion
  isSuitableForOccasion(occasion) {
    return this.occasion.length === 0 || this.occasion.includes(occasion);
  }

  // Get cost per wear
  getCostPerWear() {
    if (!this.price || this.wearCount === 0) return null;
    return (this.price / this.wearCount).toFixed(2);
  }

  // Validate item data
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Item name is required');
    }
    
    if (!this.category || this.category.trim().length === 0) {
      errors.push('Category is required');
    }
    
    if (this.price && (isNaN(this.price) || this.price < 0)) {
      errors.push('Price must be a valid positive number');
    }
    
    if (this.wearCount < 0) {
      errors.push('Wear count cannot be negative');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get display image
  getDisplayImage() {
    if (this.imageUrl) return this.imageUrl;
    
    // Fallback emoji based on category
    const categoryEmojis = {
      'tops': '👕',
      'bottoms': '👖',
      'dresses': '👗',
      'outerwear': '🧥',
      'shoes': '👟',
      'accessories': '👜',
      'jewelry': '💍',
      'bags': '🎒'
    };
    
    return categoryEmojis[this.category.toLowerCase()] || '👔';
  }
}

export default WardrobeItem;
