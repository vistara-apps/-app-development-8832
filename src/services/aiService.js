/**
 * AI Service for Study & Style application
 * Handles OpenAI API integration for fashion recommendations
 */

import OpenAI from 'openai';
import { fashionPrompts } from '../utils/prompts.js';

// OpenAI configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

class AIService {
  constructor() {
    this.model = 'gpt-4o-mini'; // Using the latest model
    this.maxTokens = 1000;
    this.temperature = 0.7;
    this.cache = new Map(); // Simple cache for responses
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Generate outfit recommendations based on user preferences
   * @param {Object} preferences - User style preferences
   * @param {Array} wardrobeItems - User's wardrobe items
   * @returns {Promise<Object>} AI recommendations
   */
  async generateOutfitRecommendations(preferences, wardrobeItems = []) {
    try {
      // Create cache key
      const cacheKey = this.createCacheKey('outfit', { preferences, wardrobeItems });
      
      // Check cache first
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // Prepare context for AI
      const context = this.prepareOutfitContext(preferences, wardrobeItems);
      const prompt = fashionPrompts.outfitRecommendation(context);

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: fashionPrompts.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      // Process and validate the response
      const processedResult = this.processOutfitRecommendations(result);
      
      // Cache the result
      this.setCache(cacheKey, processedResult);
      
      return {
        success: true,
        data: processedResult
      };

    } catch (error) {
      console.error('AI outfit recommendation error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackOutfitRecommendations(preferences)
      };
    }
  }

  /**
   * Analyze wardrobe items and provide insights
   * @param {Array} wardrobeItems - User's wardrobe items
   * @returns {Promise<Object>} Wardrobe analysis
   */
  async analyzeWardrobe(wardrobeItems) {
    try {
      const cacheKey = this.createCacheKey('wardrobe', { wardrobeItems });
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const context = this.prepareWardrobeContext(wardrobeItems);
      const prompt = fashionPrompts.wardrobeAnalysis(context);

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: fashionPrompts.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      const processedResult = this.processWardrobeAnalysis(result);
      
      this.setCache(cacheKey, processedResult);
      
      return {
        success: true,
        data: processedResult
      };

    } catch (error) {
      console.error('AI wardrobe analysis error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackWardrobeAnalysis(wardrobeItems)
      };
    }
  }

  /**
   * Generate shopping recommendations
   * @param {Object} preferences - User preferences
   * @param {Array} wardrobeItems - Current wardrobe
   * @param {number} budget - Budget constraint
   * @returns {Promise<Object>} Shopping recommendations
   */
  async generateShoppingRecommendations(preferences, wardrobeItems, budget) {
    try {
      const cacheKey = this.createCacheKey('shopping', { preferences, wardrobeItems, budget });
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const context = this.prepareShoppingContext(preferences, wardrobeItems, budget);
      const prompt = fashionPrompts.shoppingRecommendation(context);

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: fashionPrompts.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      const processedResult = this.processShoppingRecommendations(result);
      
      this.setCache(cacheKey, processedResult);
      
      return {
        success: true,
        data: processedResult
      };

    } catch (error) {
      console.error('AI shopping recommendation error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackShoppingRecommendations(preferences, budget)
      };
    }
  }

  /**
   * Generate style analysis for a specific item
   * @param {Object} item - Wardrobe item to analyze
   * @returns {Promise<Object>} Style analysis
   */
  async analyzeItemStyle(item) {
    try {
      const cacheKey = this.createCacheKey('itemStyle', { item });
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const prompt = fashionPrompts.itemStyleAnalysis(item);

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: fashionPrompts.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      this.setCache(cacheKey, result);
      
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('AI item style analysis error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackItemAnalysis(item)
      };
    }
  }

  // Helper methods for context preparation
  prepareOutfitContext(preferences, wardrobeItems) {
    return {
      occasion: preferences.occasion || 'casual',
      style: preferences.style || 'minimalist',
      budget: preferences.budget || 'moderate',
      weather: preferences.weather || 'mild',
      colors: preferences.colors || [],
      wardrobeItems: wardrobeItems.map(item => ({
        name: item.name,
        category: item.category,
        color: item.color,
        brand: item.brand,
        wearCount: item.wearCount,
        lastWorn: item.lastWornDate
      }))
    };
  }

  prepareWardrobeContext(wardrobeItems) {
    return {
      totalItems: wardrobeItems.length,
      categories: this.getCategoryBreakdown(wardrobeItems),
      colors: this.getColorBreakdown(wardrobeItems),
      brands: this.getBrandBreakdown(wardrobeItems),
      wearPatterns: this.getWearPatterns(wardrobeItems),
      items: wardrobeItems.map(item => ({
        name: item.name,
        category: item.category,
        color: item.color,
        brand: item.brand,
        wearCount: item.wearCount,
        condition: item.condition,
        price: item.price
      }))
    };
  }

  prepareShoppingContext(preferences, wardrobeItems, budget) {
    return {
      preferences,
      budget,
      currentWardrobe: this.prepareWardrobeContext(wardrobeItems),
      gaps: this.identifyWardrobeGaps(wardrobeItems),
      priorities: this.calculateShoppingPriorities(wardrobeItems, preferences)
    };
  }

  // Processing methods
  processOutfitRecommendations(result) {
    return {
      recommendations: result.recommendations || [],
      reasoning: result.reasoning || '',
      confidence: result.confidence || 0.8,
      alternatives: result.alternatives || [],
      tips: result.tips || []
    };
  }

  processWardrobeAnalysis(result) {
    return {
      overview: result.overview || {},
      strengths: result.strengths || [],
      gaps: result.gaps || [],
      recommendations: result.recommendations || [],
      styleProfile: result.styleProfile || {},
      sustainability: result.sustainability || {}
    };
  }

  processShoppingRecommendations(result) {
    return {
      priorityItems: result.priorityItems || [],
      budgetBreakdown: result.budgetBreakdown || {},
      alternatives: result.alternatives || [],
      timing: result.timing || {},
      stores: result.stores || []
    };
  }

  // Utility methods
  getCategoryBreakdown(items) {
    const breakdown = {};
    items.forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + 1;
    });
    return breakdown;
  }

  getColorBreakdown(items) {
    const breakdown = {};
    items.forEach(item => {
      if (item.color) {
        breakdown[item.color] = (breakdown[item.color] || 0) + 1;
      }
    });
    return breakdown;
  }

  getBrandBreakdown(items) {
    const breakdown = {};
    items.forEach(item => {
      if (item.brand) {
        breakdown[item.brand] = (breakdown[item.brand] || 0) + 1;
      }
    });
    return breakdown;
  }

  getWearPatterns(items) {
    return {
      mostWorn: items.sort((a, b) => b.wearCount - a.wearCount).slice(0, 5),
      leastWorn: items.filter(item => item.wearCount < 3),
      recentlyWorn: items.filter(item => {
        if (!item.lastWornDate) return false;
        const daysSince = (Date.now() - new Date(item.lastWornDate)) / (1000 * 60 * 60 * 24);
        return daysSince <= 7;
      })
    };
  }

  identifyWardrobeGaps(items) {
    const categories = this.getCategoryBreakdown(items);
    const essentialCategories = ['tops', 'bottoms', 'shoes', 'outerwear'];
    
    return essentialCategories.filter(category => 
      !categories[category] || categories[category] < 3
    );
  }

  calculateShoppingPriorities(items, preferences) {
    const gaps = this.identifyWardrobeGaps(items);
    const wearPatterns = this.getWearPatterns(items);
    
    return {
      urgent: gaps,
      seasonal: this.getSeasonalNeeds(preferences),
      replacement: wearPatterns.mostWorn.filter(item => item.condition === 'worn')
    };
  }

  getSeasonalNeeds(preferences) {
    const currentSeason = this.getCurrentSeason();
    const seasonalItems = {
      spring: ['light jacket', 'sneakers', 'light sweater'],
      summer: ['shorts', 'sandals', 't-shirts', 'sundress'],
      fall: ['boots', 'cardigan', 'jeans'],
      winter: ['coat', 'boots', 'sweaters', 'scarf']
    };
    
    return seasonalItems[currentSeason] || [];
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  // Cache management
  createCacheKey(type, data) {
    return `${type}_${JSON.stringify(data)}`.replace(/\s+/g, '');
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Fallback methods for when AI fails
  getFallbackOutfitRecommendations(preferences) {
    return {
      recommendations: [
        {
          id: 'fallback_1',
          title: 'Classic Casual',
          description: 'A timeless combination that works for most occasions',
          items: ['White t-shirt', 'Dark jeans', 'Sneakers'],
          confidence: 0.7
        }
      ],
      reasoning: 'Fallback recommendation due to AI service unavailability',
      confidence: 0.7
    };
  }

  getFallbackWardrobeAnalysis(items) {
    return {
      overview: {
        totalItems: items.length,
        mostCommonCategory: 'tops',
        averageWearCount: Math.round(items.reduce((sum, item) => sum + item.wearCount, 0) / items.length)
      },
      recommendations: ['Consider adding more versatile pieces to your wardrobe']
    };
  }

  getFallbackShoppingRecommendations(preferences, budget) {
    return {
      priorityItems: [
        { item: 'Basic white t-shirt', priority: 'high', estimatedPrice: '$20' },
        { item: 'Dark wash jeans', priority: 'high', estimatedPrice: '$60' }
      ],
      budgetBreakdown: {
        essentials: budget * 0.6,
        trendy: budget * 0.4
      }
    };
  }

  getFallbackItemAnalysis(item) {
    return {
      styleCategory: item.category,
      versatility: 'medium',
      seasonality: 'all-season',
      recommendations: ['Pair with neutral colors for maximum versatility']
    };
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;
export { AIService };
