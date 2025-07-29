import React from 'react';
import { ShoppingBag, Star, MessageSquare, Mail, TrendingUp, LucideIcon } from 'lucide-react';

interface NavButtonProps {
  tab: string;
  icon: LucideIcon;
  label: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ tab, icon: Icon, label, activeTab, setActiveTab }) => (
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

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => (
  <nav className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex gap-2">
        <NavButton tab="dashboard" icon={TrendingUp} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavButton tab="orders" icon={ShoppingBag} label="Orders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavButton tab="recommendations" icon={Star} label="Recommendations" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavButton tab="inbox" icon={Mail} label="Inbox" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavButton tab="chat" icon={MessageSquare} label="Chat" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  </nav>
);
