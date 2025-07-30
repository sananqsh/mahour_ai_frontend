import React, { useState, useEffect } from 'react';
import {
  Header,
  Navigation,
  Dashboard,
  Orders,
  Recommendations,
  Inbox,
  Chat
} from './components';
import { api } from './services/api';
import { useApiData } from './hooks/useApiData';
import {
  DashboardData,
  Order,
  Message,
  Product,
  ChatMessage
} from './services/types';

import { AuthProvider, useAuth } from "./contexts";
import { AuthModal } from "./components";

const MainApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  // Note: user state now comes from AuthContext, not local state

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inbox, setInbox] = useState<Message[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const { loadingStates, errorStates, setLoading, setError } = useApiData();

  // Load data functions
  const loadDashboard = async () => {
    setLoading('dashboard', true);
    setError('dashboard', null);
    try {
      const data = await api.dashboard();
      setDashboardData(data);
      // Don't setUser here – handled by AuthContext now, unless wanting to sync user info from backend
    } catch (error) {
      setError('dashboard', error as Error);
    } finally {
      setLoading('dashboard', false);
    }
  };

  const loadOrders = async () => {
    setLoading('orders', true);
    setError('orders', null);
    try {
      const data = await api.orders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      setError('orders', error as Error);
    } finally {
      setLoading('orders', false);
    }
  };

  const loadInbox = async () => {
    setLoading('inbox', true);
    setError('inbox', null);
    try {
      const data = await api.inbox();
      setInbox(Array.isArray(data) ? data : data.messages || []);
    } catch (error) {
      setError('inbox', error as Error);
    } finally {
      setLoading('inbox', false);
    }
  };

  const loadRecommendations = async () => {
    setLoading('recommendations', true);
    setError('recommendations', null);
    try {
      const data = await api.recommendations();
      setRecommendations(Array.isArray(data) ? data : data.recommendations || []);
    } catch (error) {
      setError('recommendations', error as Error);
    } finally {
      setLoading('recommendations', false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', message: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);

    setLoading('chat', true);
    try {
      const response = await api.chat(chatInput);
      const botMessage: ChatMessage = {
        sender: 'bot',
        message: response.reply || response.message,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        sender: 'bot',
        message: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading('chat', false);
    }

    setChatInput('');
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await api.markAsRead(messageId);
      setInbox(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, readFlag: true, read_flag: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    if (authLoading) {return};
    if (user) {
      loadDashboard();
      loadOrders();
      loadInbox();
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-700 font-medium text-lg">Loading...</span>
        </div>
      </div>
    );
  }
  if (!user) return <AuthModal />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            dashboardData={dashboardData}
            loading={loadingStates.dashboard}
            error={errorStates.dashboard}
          />
        )}

        {activeTab === 'orders' && (
          <Orders
            orders={orders}
            loading={loadingStates.orders}
            error={errorStates.orders}
          />
        )}

        {activeTab === 'recommendations' && (
          <Recommendations
            recommendations={recommendations}
            loading={loadingStates.recommendations}
            error={errorStates.recommendations}
            onRefresh={loadRecommendations}
          />
        )}

        {activeTab === 'inbox' && (
          <Inbox
            inbox={inbox}
            loading={loadingStates.inbox}
            error={errorStates.inbox}
            onMarkAsRead={handleMarkAsRead}
          />
        )}

        {activeTab === 'chat' && (
          <Chat
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;
