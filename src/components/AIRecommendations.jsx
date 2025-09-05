import React, { useState } from 'react';
import { Sparkles, RefreshCw, Heart, ShoppingBag, Star } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const AIRecommendations = () => {
  const [preferences, setPreferences] = useState({
    occasion: '',
    style: '',
    budget: '',
    weather: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const { createSession } = usePaymentContext();

  const occasions = ['Casual', 'Formal', 'Party', 'Work', 'Date', 'Study'];
  const styles = ['Minimalist', 'Bohemian', 'Preppy', 'Streetwear', 'Vintage', 'Trendy'];
  const budgets = ['Under $50', '$50-100', '$100-200', '$200+'];
  const weather = ['Sunny', 'Rainy', 'Cold', 'Hot', 'Windy'];

  const generateRecommendations = () => {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          title: 'Cozy Study Session',
          description: 'Perfect for long library hours',
          items: ['Oversized sweater', 'High-waisted jeans', 'White sneakers'],
          confidence: 95,
          image: '👕',
          price: '$120'
        },
        {
          id: 2,
          title: 'Coffee Date Chic',
          description: 'Casual yet put-together',
          items: ['Cream blouse', 'Dark jeans', 'Ankle boots'],
          confidence: 88,
          image: '👗',
          price: '$95'
        },
        {
          id: 3,
          title: 'Campus Cool',
          description: 'Effortlessly stylish',
          items: ['Graphic tee', 'Denim jacket', 'Sneakers'],
          confidence: 92,
          image: '👚',
          price: '$75'
        }
      ];
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 2000);
  };

  const handlePremiumFeature = async () => {
    try {
      await createSession();
      setShowPremium(true);
      // Generate premium recommendations
      setTimeout(() => {
        const premiumRecommendations = [
          {
            id: 4,
            title: 'Advanced Style Analysis',
            description: 'AI-analyzed perfect fit for your body type',
            items: ['Tailored blazer', 'Slim-fit trousers', 'Leather loafers'],
            confidence: 98,
            image: '🎯',
            price: '$280',
            premium: true
          }
        ];
        setRecommendations(prev => [...prev, ...premiumRecommendations]);
      }, 1000);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Style Assistant</h2>
            <p className="text-gray-600">Get personalized outfit recommendations</p>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tell us about your style</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
            <select
              value={preferences.occasion}
              onChange={(e) => setPreferences({...preferences, occasion: e.target.value})}
              className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select occasion</option>
              {occasions.map(occasion => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <select
              value={preferences.style}
              onChange={(e) => setPreferences({...preferences, style: e.target.value})}
              className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select style</option>
              {styles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
            <select
              value={preferences.budget}
              onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
              className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select budget</option>
              {budgets.map(budget => (
                <option key={budget} value={budget}>{budget}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weather</label>
            <select
              value={preferences.weather}
              onChange={(e) => setPreferences({...preferences, weather: e.target.value})}
              className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select weather</option>
              {weather.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateRecommendations}
          disabled={isLoading || !preferences.occasion || !preferences.style}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating recommendations...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Get AI Recommendations</span>
            </>
          )}
        </button>
      </div>

      {/* Premium Feature Card */}
      {!showPremium && (
        <div className="glass-card rounded-xl p-6 border-2 border-yellow-300/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Premium Style Analysis</h3>
                <p className="text-sm text-gray-600">Advanced AI with body type analysis</p>
              </div>
            </div>
            <button
              onClick={handlePremiumFeature}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Unlock for $0.50
            </button>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Your Style Recommendations</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className={`glass-card rounded-xl p-5 ${rec.premium ? 'border-2 border-yellow-300/50' : ''}`}>
                {rec.premium && (
                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-medium text-yellow-600">PREMIUM</span>
                  </div>
                )}
                
                <div className="text-4xl mb-3 text-center">{rec.image}</div>
                
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${rec.confidence > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs text-gray-600">{rec.confidence}%</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                
                <div className="space-y-1 mb-4">
                  {rec.items.map((item, index) => (
                    <div key={index} className="text-xs bg-white/50 px-2 py-1 rounded">
                      {item}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{rec.price}</span>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                      <ShoppingBag className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;