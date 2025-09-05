import React from 'react';
import { Sparkles, Heart, Star, Shirt } from 'lucide-react';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="floating-element top-20 left-10">
        <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="floating-element top-32 right-20">
        <div className="w-6 h-6 bg-pink-200/30 rounded-full backdrop-blur-sm flex items-center justify-center">
          <Heart className="w-3 h-3 text-pink-600" />
        </div>
      </div>
      
      <div className="floating-element top-60 left-1/4">
        <div className="w-10 h-10 bg-blue-200/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
          <Star className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div className="floating-element bottom-40 right-10">
        <div className="w-7 h-7 bg-purple-200/25 rounded-lg backdrop-blur-sm flex items-center justify-center">
          <Shirt className="w-4 h-4 text-purple-600" />
        </div>
      </div>
      
      <div className="floating-element bottom-20 left-16">
        <div className="w-5 h-5 bg-yellow-200/30 rounded-full backdrop-blur-sm"></div>
      </div>
      
      <div className="floating-element top-3/4 left-3/4">
        <div className="w-4 h-4 bg-green-200/25 rounded-sm backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

export default FloatingElements;