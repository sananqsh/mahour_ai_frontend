import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, MessageSquare, Gift, User, TrendingUp, Calendar, Mail, Send, RefreshCw, Brain, Settings, Users, Bell } from 'lucide-react';

// Mock Data
const mockData = {
  user: {
    id: 'user1',
    name: 'Sarah Johnson',
    tier: 'Gold',
    points: 2850
  },

  products: [
    { id: 'p1', name: 'Wireless Headphones', category: 'Electronics', price: 199.99, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop' },
    { id: 'p2', name: 'Running Shoes', category: 'Sports', price: 129.99, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop' },
    { id: 'p3', name: 'Coffee Maker', category: 'Kitchen', price: 89.99, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop' },
    { id: 'p4', name: 'Yoga Mat', category: 'Sports', price: 39.99, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop' },
    { id: 'p5', name: 'Smart Watch', category: 'Electronics', price: 299.99, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop' },
    { id: 'p6', name: 'Bluetooth Speaker', category: 'Electronics', price: 79.99, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&h=150&fit=crop' },
    { id: 'p7', name: 'Kitchen Knife Set', category: 'Kitchen', price: 149.99, imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=150&h=150&fit=crop' },
    { id: 'p8', name: 'Protein Powder', category: 'Sports', price: 49.99, imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=150&h=150&fit=crop' }
  ],

  orders: [
    { id: 'o1', userId: 'user1', items: [{ productId: 'p1', quantity: 1, price: 199.99 }], date: '2024-01-15', total: 199.99 },
    { id: 'o2', userId: 'user1', items: [{ productId: 'p2', quantity: 1, price: 129.99 }, { productId: 'p4', quantity: 1, price: 39.99 }], date: '2024-02-01', total: 169.98 },
    { id: 'o3', userId: 'user1', items: [{ productId: 'p3', quantity: 1, price: 89.99 }], date: '2024-02-20', total: 89.99 }
  ],

  inbox: [
    { id: 'i1', userId: 'user1', title: 'Welcome to Gold Tier!', body: 'Congratulations! You\'ve been upgraded to Gold tier and earned 100 bonus points.', date: '2024-02-21', readFlag: false },
    { id: 'i2', userId: 'user1', title: 'Special Offer Just for You', body: 'Get 20% off your next purchase of sports equipment. Use code GOLD20.', date: '2024-02-18', readFlag: false },
    { id: 'i3', userId: 'user1', title: 'Points Earned', body: 'You earned 50 bonus points for your recent purchase!', date: '2024-02-15', readFlag: true }
  ]
};

// Mock API functions
const api = {
  getDashboard: () => {
    const totalOrders = mockData.orders.length;
    const totalSpent = mockData.orders.reduce((sum, order) => sum + order.total, 0);
    return Promise.resolve({
      totalOrders,
      totalSpent,
      points: mockData.user.points,
      tier: mockData.user.tier
    });
  },

  getOrders: () => Promise.resolve(mockData.orders),

  getInbox: () => Promise.resolve(mockData.inbox),

  getRecommendations: () => {
    // Mock LLM-powered recommendations
    const recommendations = [
      { productId: 'p5', rationale: 'Perfect companion to your wireless headphones for fitness tracking and music control.' },
      { productId: 'p8', rationale: 'Great for post-workout recovery, especially with your new running shoes.' },
      { productId: 'p6', rationale: 'Complements your coffee maker setup for kitchen entertainment while brewing.' },
      { productId: 'p7', rationale: 'Essential kitchen upgrade to pair with your coffee maker for meal prep.' }
    ].map(rec => {
      const product = mockData.products.find(p => p.id === rec.productId);
      return { ...product, rationale: rec.rationale };
    });

    return Promise.resolve(recommendations);
  },

  chat: (message: string, conversationId: string) => {
    // Mock chat responses
    const responses = [
      "Based on your recent coffee maker purchase, I'd recommend our premium coffee beans or a milk frother to complete your setup!",
      "Your Gold tier status gives you access to exclusive deals! Check out our 20% off sports equipment offer.",
      "I can see you love fitness gear! Our protein powder pairs perfectly with your running routine.",
      "With 2850 points, you're close to Platinum tier! Just 650 more points to unlock even better rewards."
    ];

    const reply = responses[Math.floor(Math.random() * responses.length)];
    return Promise.resolve({ reply, conversationId: conversationId || 'conv1' });
  },

  markAsRead: (messageId: string) => {
    const message = mockData.inbox.find(m => m.id === messageId);
    if (message) message.readFlag = true;
    return Promise.resolve();
  }
};


function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [inbox, setInbox] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
    loadOrders();
    loadInbox();
  }, []);

  const loadDashboard = async () => {
    const data: any = await api.getDashboard();
    setDashboardData(data);
  };

  const loadOrders = async () => {
    const data: any = await api.getOrders();
    setOrders(data);
  };

  const loadInbox = async () => {
    const data: any = await api.getInbox();
    setInbox(data);
  };

  const loadRecommendations = async () => {
    setLoading(true);
    const data: any = await api.getRecommendations();
    setRecommendations(data);
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', message: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage] as any);

    const response: any = await api.chat(chatInput, 'conv1'); // TODO: get conversation id from backend
    const botMessage = { sender: 'bot', message: response.reply, timestamp: new Date() };
    setChatMessages(prev => [...prev, botMessage] as any);

    setChatInput('');
  };

  const handleMarkAsRead = async (messageId: string) => {
    await api.markAsRead(messageId);
    setInbox(prev => prev.map((msg: any) =>
      msg.id === messageId ? { ...msg, readFlag: true } : msg as any
    ));
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const NavButton = ({ tab, icon: Icon, label }: { tab: string, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Customer Club</h1>
                <p className="text-sm text-gray-600">Welcome back, {mockData.user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{mockData.user.tier} Member</div>
                <div className="text-sm text-gray-600">{mockData.user.points} Points</div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <NavButton tab="dashboard" icon={TrendingUp} label="Dashboard" />
            <NavButton tab="orders" icon={ShoppingBag} label="Orders" />
            <NavButton tab="recommendations" icon={Star} label="Recommendations" />
            <NavButton tab="inbox" icon={Mail} label="Inbox" />
            <NavButton tab="chat" icon={MessageSquare} label="Chat" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.totalOrders}</p>
                  </div>
                  <ShoppingBag className="text-blue-600" size={40} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData.totalSpent)}</p>
                  </div>
                  <TrendingUp className="text-green-600" size={40} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Tier</p>
                    <p className="text-3xl font-bold text-yellow-600">{dashboardData.tier}</p>
                  </div>
                  <Star className="text-yellow-600" size={40} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-3xl font-bold text-purple-600">{dashboardData.points}</p>
                  </div>
                  <Gift className="text-purple-600" size={40} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.items.length} item(s)</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Recommendations</h2>
              <button
                onClick={loadRecommendations}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                Get New Suggestions
              </button>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(product => (
                  <div key={product.id} className="bg-white p-6 rounded-lg shadow">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-xl font-bold text-blue-600 mb-3">{formatCurrency(product.price)}</p>
                    <p className="text-sm text-gray-600 mb-4">{product.rationale}</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Click "Get New Suggestions" to see personalized recommendations!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
            <div className="bg-white rounded-lg shadow">
              {inbox.map(message => (
                <div
                  key={message.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    !message.readFlag ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                  onClick={() => handleMarkAsRead(message.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${!message.readFlag ? 'text-blue-900' : 'text-gray-900'}`}>
                        {message.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{message.body}</p>
                    </div>
                    <div className="text-sm text-gray-500 ml-4">
                      {formatDate(message.date)}
                    </div>
                  </div>
                  {!message.readFlag && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Support Chat</h2>
            <div className="bg-white rounded-lg shadow">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="mx-auto mb-4" size={48} />
                    <p>Start a conversation! Ask me about products, your account, or anything else.</p>
                  </div>
                )}

                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
