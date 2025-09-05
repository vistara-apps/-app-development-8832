import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Home, 
  Sparkles, 
  Shirt, 
  BookOpen, 
  ShoppingBag,
  Menu 
} from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ai-recommendations', label: 'AI Style', icon: Sparkles },
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
    { id: 'lookbooks', label: 'Lookbooks', icon: BookOpen },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  ];

  return (
    <header className="glass-card border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text hidden sm:block">
                Study & Style
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-white/30 text-purple-800 font-medium'
                      : 'text-gray-700 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex space-x-1 overflow-x-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 whitespace-nowrap ${
                activeTab === id
                  ? 'bg-white/30 text-purple-800 font-medium'
                  : 'text-gray-700 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;