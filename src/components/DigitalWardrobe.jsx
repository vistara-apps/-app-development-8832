import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Plus, 
  Upload, 
  Filter, 
  Search,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useWardrobe } from '../hooks/useLocalStorage.js';
import ImageUpload from './ImageUpload.jsx';
import WardrobeItem from '../models/WardrobeItem.js';

const DigitalWardrobe = () => {
  const { items: wardrobeItems, addItem, updateItem, removeItem, wearItem, isLoading, error } = useWardrobe();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    color: '',
    brand: '',
    size: '',
    price: '',
    tags: [],
    season: [],
    occasion: []
  });

  // Filter and sort items
  const filteredItems = wardrobeItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'wearCount':
          return b.wearCount - a.wearCount;
        case 'lastWorn':
          return new Date(b.lastWornDate || 0) - new Date(a.lastWornDate || 0);
        case 'price':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

  // Get unique categories
  const categories = ['all', ...new Set(wardrobeItems.map(item => item.category.toLowerCase()))];

  // Handle image upload
  const handleImageUpload = (uploadResult) => {
    setNewItem(prev => ({
      ...prev,
      imageUrl: uploadResult.url
    }));
  };

  // Handle add item
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category) {
      alert('Please fill in at least the name and category');
      return;
    }

    try {
      const item = new WardrobeItem({
        ...newItem,
        price: newItem.price ? parseFloat(newItem.price) : null,
        tags: typeof newItem.tags === 'string' ? newItem.tags.split(',').map(t => t.trim()) : newItem.tags
      });

      await addItem(item);
      setShowAddModal(false);
      setNewItem({
        name: '',
        category: '',
        color: '',
        brand: '',
        size: '',
        price: '',
        tags: [],
        season: [],
        occasion: []
      });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  // Handle edit item
  const handleEditItem = async () => {
    if (!editingItem) return;

    try {
      await updateItem(editingItem.itemId, {
        ...editingItem,
        price: editingItem.price ? parseFloat(editingItem.price) : null,
        tags: typeof editingItem.tags === 'string' ? editingItem.tags.split(',').map(t => t.trim()) : editingItem.tags
      });
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  // Handle delete item
  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await removeItem(itemId);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  // Handle wear item
  const handleWearItem = async (itemId) => {
    try {
      await wearItem(itemId);
    } catch (error) {
      console.error('Error updating wear count:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading wardrobe: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'frequently-worn':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'underutilized':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const wardrobeStats = {
    totalItems: wardrobeItems.length,
    mostWorn: wardrobeItems.reduce((prev, current) => 
      prev.wearCount > current.wearCount ? prev : current
    ),
    underutilized: wardrobeItems.filter(item => item.status === 'underutilized').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Digital Wardrobe</h2>
              <p className="text-gray-600">Manage and track your clothing items</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">{wardrobeStats.totalItems}</p>
            </div>
            <Shirt className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Worn</p>
              <p className="text-lg font-bold text-gray-800">{wardrobeStats.mostWorn.name}</p>
              <p className="text-xs text-gray-500">{wardrobeStats.mostWorn.wearCount} times</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Underutilized</p>
              <p className="text-2xl font-bold text-gray-800">{wardrobeStats.underutilized}</p>
              <p className="text-xs text-gray-500">items need attention</p>
            </div>
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your wardrobe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-4 hover:shadow-lg transition-all duration-200">
            <div className="text-4xl text-center mb-3">{item.image}</div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status.replace('-', ' ')}
                </span>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Brand:</span>
                  <span>{item.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color:</span>
                  <span>{item.color}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worn:</span>
                  <span>{item.wearCount} times</span>
                </div>
                <div className="flex justify-between">
                  <span>Last worn:</span>
                  <span>{item.lastWorn}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-3 bg-white/50 hover:bg-white/70 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g., Blue Denim Jacket"
                  className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select category</option>
                  <option>Tops</option>
                  <option>Bottoms</option>
                  <option>Dresses</option>
                  <option>Shoes</option>
                  <option>Accessories</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    placeholder="e.g., Navy Blue"
                    className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g., H&M"
                    className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddItem(false)}
                className="flex-1 bg-white/50 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-white/70 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalWardrobe;
