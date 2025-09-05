import React, { useState } from 'react';
import { BookOpen, Heart, Share2, Eye, Filter } from 'lucide-react';

const Lookbooks = () => {
  const [activeLookbook, setActiveLookbook] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const lookbooks = [
    {
      id: 1,
      title: 'First Day Confidence',
      description: 'Perfect outfits to make a great first impression',
      scenario: 'First Day',
      aesthetic: 'Professional',
      likes: 145,
      views: 892,
      image: '🎓',
      outfits: [
        {
          name: 'Classic Scholar',
          items: ['White button-down', 'Navy blazer', 'Dark jeans', 'Loafers'],
          description: 'Timeless and sophisticated'
        },
        {
          name: 'Casual Confident',
          items: ['Knit sweater', 'Chinos', 'White sneakers', 'Watch'],
          description: 'Relaxed yet polished'
        }
      ]
    },
    {
      id: 2,
      title: 'Weekend Vibes',
      description: 'Casual and comfortable looks for leisure time',
      scenario: 'Weekend',
      aesthetic: 'Casual',
      likes: 203,
      views: 1247,
      image: '🌟',
      outfits: [
        {
          name: 'Cozy Comfort',
          items: ['Oversized hoodie', 'Joggers', 'Chunky sneakers'],
          description: 'Ultimate relaxation wear'
        },
        {
          name: 'Cafe Chic',
          items: ['Knit cardigan', 'High-waist jeans', 'Ankle boots'],
          description: 'Perfect for coffee dates'
        }
      ]
    },
    {
      id: 3,
      title: 'Party Ready',
      description: 'Stand out looks for social events and parties',
      scenario: 'Party',
      aesthetic: 'Trendy',
      likes: 321,
      views: 1856,
      image: '✨',
      outfits: [
        {
          name: 'Night Out Glam',
          items: ['Sequin top', 'Black mini skirt', 'Heeled boots'],
          description: 'Sparkle and shine'
        },
        {
          name: 'Casual Party',
          items: ['Crop top', 'High-waist pants', 'Statement earrings'],
          description: 'Effortlessly cool'
        }
      ]
    },
    {
      id: 4,
      title: 'Interview Success',
      description: 'Professional outfits that command respect',
      scenario: 'Interview',
      aesthetic: 'Professional',
      likes: 187,
      views: 743,
      image: '💼',
      outfits: [
        {
          name: 'Power Player',
          items: ['Tailored suit', 'Silk blouse', 'Pointed heels'],
          description: 'Command the room'
        },
        {
          name: 'Smart Casual',
          items: ['Blazer', 'Dress pants', 'Oxford shoes'],
          description: 'Professional yet approachable'
        }
      ]
    },
    {
      id: 5,
      title: 'Study Session Style',
      description: 'Comfortable yet cute looks for long study hours',
      scenario: 'Study',
      aesthetic: 'Minimalist',
      likes: 156,
      views: 634,
      image: '📚',
      outfits: [
        {
          name: 'Library Chic',
          items: ['Cozy sweater', 'Leggings', 'Comfortable sneakers'],
          description: 'Comfort meets style'
        },
        {
          name: 'Focus Mode',
          items: ['Soft hoodie', 'Sweatpants', 'Slip-on shoes'],
          description: 'Maximum comfort'
        }
      ]
    },
    {
      id: 6,
      title: 'Date Night Dreams',
      description: 'Romantic and stylish outfits for special occasions',
      scenario: 'Date',
      aesthetic: 'Romantic',
      likes: 278,
      views: 1432,
      image: '💕',
      outfits: [
        {
          name: 'Dinner Elegance',
          items: ['Midi dress', 'Heeled sandals', 'Delicate jewelry'],
          description: 'Sophisticated romance'
        },
        {
          name: 'Casual Date',
          items: ['Flowy top', 'Dark jeans', 'Ballet flats'],
          description: 'Effortlessly charming'
        }
      ]
    }
  ];

  const scenarios = ['all', 'First Day', 'Weekend', 'Party', 'Interview', 'Study', 'Date'];

  const filteredLookbooks = lookbooks.filter(lookbook => 
    activeFilter === 'all' || lookbook.scenario === activeFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Style Lookbooks</h2>
            <p className="text-gray-600">Curated outfit collections for every occasion</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          {scenarios.map((scenario) => (
            <button
              key={scenario}
              onClick={() => setActiveFilter(scenario)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === scenario
                  ? 'bg-green-500 text-white'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              {scenario === 'all' ? 'All Scenarios' : scenario}
            </button>
          ))}
        </div>
      </div>

      {/* Lookbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLookbooks.map((lookbook) => (
          <div key={lookbook.id} className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              <div className="text-4xl text-center mb-4">{lookbook.image}</div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{lookbook.title}</h3>
                  <p className="text-sm text-gray-600">{lookbook.description}</p>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{lookbook.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{lookbook.likes}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-white/50 rounded text-xs text-gray-600">
                    {lookbook.scenario}
                  </span>
                  <span className="px-2 py-1 bg-white/50 rounded text-xs text-gray-600">
                    {lookbook.aesthetic}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-6">
              <button
                onClick={() => setActiveLookbook(lookbook)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                View Outfits
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lookbook Detail Modal */}
      {activeLookbook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{activeLookbook.title}</h3>
                <p className="text-gray-600">{activeLookbook.description}</p>
              </div>
              <button
                onClick={() => setActiveLookbook(null)}
                className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center hover:bg-white/70 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {activeLookbook.outfits.map((outfit, index) => (
                <div key={index} className="bg-white/40 rounded-xl p-5">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{outfit.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{outfit.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Items needed:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {outfit.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="bg-white/50 px-3 py-2 rounded-lg text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button className="flex-1 bg-white/50 hover:bg-white/70 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Save Look</span>
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lookbooks;