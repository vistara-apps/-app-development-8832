import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIRecommendations from './components/AIRecommendations';
import DigitalWardrobe from './components/DigitalWardrobe';
import Lookbooks from './components/Lookbooks';
import ShoppingAssistant from './components/ShoppingAssistant';
import FloatingElements from './components/FloatingElements';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'ai-recommendations':
        return <AIRecommendations />;
      case 'wardrobe':
        return <DigitalWardrobe />;
      case 'lookbooks':
        return <Lookbooks />;
      case 'shopping':
        return <ShoppingAssistant />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 relative overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;