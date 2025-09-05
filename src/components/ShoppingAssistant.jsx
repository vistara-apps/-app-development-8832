import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Bell, 
  DollarSign, 
  TrendingDown,
  Star,
  ExternalLink,
  Heart
} from 'lucide-react';

const ShoppingAssistant = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');

  const trendingItems = [
    {
      id: 1,
      name: 'Oversized Blazer',
      originalPrice: 89.99,
      salePrice: 62.99,
      discount: 30,
      brand: 'Zara',
      image: '🧥',
      alternatives: 3,
      trending: true
    },
    {
      id: 2,
      name: 'High-Waist Jeans',
      originalPrice: 79.99,
      salePrice: 55.99,
      discount: 30,
      brand: 'H&M',
      image: '👖',
      alternatives: 5,
      trending: true
    },
    {
      id: 3,
      name: 'Chunky Sneakers',
      originalPrice: 120.00,
      salePrice: 96.00,
      discount: 20,
      brand: 'Nike',
      image: '👟',
      alternatives: 4,
      trending: true
    }
  ];

  const alternatives = [
    {
      id: 1,
      original: 'Designer White Sneakers - $200',
      alternative: 'Similar Style Sneakers',
      price: 45.99,
      savings: 154.01,
      brand: 'Target',
      image: '👟',
      similarity: 95
    },
    {
      id: 2,
      original: 'Luxury Handbag - $350',
      alternative: 'Designer-Inspired Bag',
      price: 29.99,
      savings: 320.01,
      brand: 'Forever 21',
      image: '👜',
      similarity: 88
    },
    {
      id: 3,
      original: 'High-End Sunglasses - $180',
      alternative: 'Trendy Sunglasses',
      price: 24.99,
      savings: 155.01,
      brand: 'ASOS',
      image: '🕶️',
      similarity: 92
    }
  ];

  const saleAlerts = [
    {
      id: 1,
      item: 'Black Leather Jacket',
      brand: 'Zara',
      originalPrice: 129.99,
      salePrice: 89.99,
      discount: 31,
      timeLeft: '2 days',
      image: '🧥'
    },
    {
      id: 2,
      item: 'White Button Shirt',
      brand: 'Uniqlo',
      originalPrice: 39.99,
      salePrice: 29.99,
      discount: 25,
      timeLeft: '6 hours',
      image: '👔'
    }
  ];

  const addPriceAlert = (item) => {
    setPriceAlerts([...priceAlerts, { ...item, alertSet: true }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Smart Shopping Assistant</h2>
            <p className="text-gray-600">Find deals and affordable alternatives</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for items or paste a product link..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex space-x-2">
          {[
            { id: 'trending', label: 'Trending Deals', icon: TrendingDown },
            { id: 'alternatives', label: 'Find Alternatives', icon: Search },
            { id: 'alerts', label: 'Sale Alerts', icon: Bell }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'trending' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Trending Deals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingItems.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                <div className="text-4xl text-center mb-3">{item.image}</div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-800">${item.salePrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${item.originalPrice}</span>
                    </div>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      -{item.discount}%
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {item.alternatives} similar alternatives available
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-white/50 hover:bg-white/70 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button 
                      onClick={() => addPriceAlert(item)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <Bell className="w-3 h-3" />
                      <span>Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alternatives' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Affordable Alternatives</h3>
          <div className="space-y-4">
            {alternatives.map((alt) => (
              <div key={alt.id} className="glass-card rounded-xl p-5">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="text-4xl">{alt.image}</div>
                  
                  <div className="flex-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Original Item</p>
                        <p className="font-medium text-gray-800">{alt.original}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Alternative</p>
                        <p className="font-medium text-gray-800">{alt.alternative}</p>
                        <p className="text-sm text-gray-600">{alt.brand}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-green-600">${alt.price}</span>
                        <span className="text-sm text-green-600">Save ${alt.savings.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{alt.similarity}% similar</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button className="bg-white/50 hover:bg-white/70 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Item</span>
                    </button>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Sale Alerts</h3>
            <span className="text-sm text-gray-600">
              {priceAlerts.length} items being tracked
            </span>
          </div>
          
          {saleAlerts.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">Active Sales</h4>
              {saleAlerts.map((alert) => (
                <div key={alert.id} className="glass-card rounded-xl p-5">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{alert.image}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{alert.item}</h4>
                      <p className="text-sm text-gray-600">{alert.brand}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-lg font-bold text-gray-800">${alert.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">${alert.originalPrice}</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          -{alert.discount}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-orange-600 font-medium">
                        {alert.timeLeft} left
                      </p>
                      <button className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {priceAlerts.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">Your Price Alerts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priceAlerts.map((alert, index) => (
                  <div key={index} className="glass-card rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{alert.image}</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{alert.name}</h5>
                        <p className="text-sm text-gray-600">{alert.brand}</p>
                        <p className="text-sm text-green-600">Alert set for price drops</p>
                      </div>
                      <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {saleAlerts.length === 0 && priceAlerts.length === 0 && (
            <div className="glass-card rounded-xl p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">No alerts yet</h4>
              <p className="text-gray-600">Set up price alerts to never miss a great deal!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingAssistant;