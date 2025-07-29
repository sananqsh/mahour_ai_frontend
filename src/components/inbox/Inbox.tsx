import React from 'react';
import { Message } from '../../services/types';
import { formatDate } from '../../utils/formatters';

interface InboxProps {
  inbox: Message[];
  loading: boolean;
  error: Error | null;
  onMarkAsRead: (messageId: string) => void;
}

export const Inbox: React.FC<InboxProps> = ({ inbox, loading, error, onMarkAsRead }) => {
  if (loading) return <div className="text-center py-8">Loading inbox...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading inbox: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
      <div className="bg-white rounded-lg shadow">
        {inbox && inbox.length > 0 ? (
          inbox.map(message => (
            <div
              key={message.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                !message.readFlag && !message.read_flag ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
              onClick={() => onMarkAsRead(message.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium ${!message.readFlag && !message.read_flag ? 'text-blue-900' : 'text-gray-900'}`}>
                    {message.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{message.body}</p>
                </div>
                <div className="text-sm text-gray-500 ml-4">
                  {formatDate(message.date || message.created_at)}
                </div>
              </div>
              {(!message.readFlag && !message.read_flag) && (
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No messages found</div>
        )}
      </div>
    </div>
  );
};
