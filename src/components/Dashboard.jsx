import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Shirt, 
  ShoppingCart,
  Sparkles,
  Heart,
  Award,
  DollarSign 
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const stats = [
    {
      title: 'Outfits Created',
      value: '47',
      change: '+12%',
      icon: Shirt,
      color: 'bg-blue-500'
    },
    {
      title: 'Style Score',
      value: '8.5',
      change: '+0.3',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      title: 'Money Saved',
      value: '$340',
      change: '+$89',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Wardrobe Items',
      value: '124',
      change: '+8',
      icon: Heart,
      color: 'bg-pink-500'
    }
  ];

  const quickActions = [
    {
      title: 'Get AI Outfit',
      description: 'Let AI suggest your next look',
      icon: Sparkles,
      action: () => setActiveTab('ai-recommendations'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Add to Wardrobe',
      description: 'Upload new clothing items',
      icon: Shirt,
      action: () => setActiveTab('wardrobe'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Browse Lookbooks',
      description: 'Explore curated styles',
      icon: Users,
      action: () => setActiveTab('lookbooks'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Smart Shopping',
      description: 'Find deals & alternatives',
      icon: ShoppingCart,
      action: () => setActiveTab('shopping'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivity = [
    {
      action: 'Created outfit',
      item: 'Casual Friday Look',
      time: '2 hours ago',
      icon: Shirt
    },
    {
      action: 'Added item',
      item: 'Navy Blue Sweater',
      time: '1 day ago',
      icon: Heart
    },
    {
      action: 'Saved deal',
      item: 'White Sneakers - 30% off',
      time: '2 days ago',
      icon: ShoppingCart
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, Fashionista! ✨
            </h2>
            <p className="text-gray-600">
              Ready to create some stunning outfits today?
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setActiveTab('ai-recommendations')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Get AI Suggestions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-all duration-200 text-left"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.item}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;