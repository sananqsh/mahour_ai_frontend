import React from 'react';
import { User } from 'lucide-react';
import { User as UserType } from '../../services/types';
import { MahourIcon } from '../icons/MahourAI';

interface HeaderProps {
  user: UserType | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <MahourIcon size={50} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mahour AI Customer Club</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Loading...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{user?.tier || '--'} Member</div>
            <div className="text-sm text-gray-600">{user?.points || 0} Points</div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  </header>
);
