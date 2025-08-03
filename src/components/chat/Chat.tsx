import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

import { ChatMessage } from '../../services/types';
import { formatDateTime } from '../../utils/formatters';

interface ChatProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (value: string) => void;
  onSendMessage: () => void;
}

export const Chat: React.FC<ChatProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  onSendMessage
}) => (
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
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {formatDateTime(msg.timestamp)}
              </p>
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
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={onSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
