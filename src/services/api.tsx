const API_BASE_URL = 'http://localhost:8000';

const apiService = {
  get: async (endpoint: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },

  put: async (endpoint: string, data: any = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error putting to ${endpoint}:`, error);
      throw error;
    }
  }
};

export const api = {
  dashboard: () => apiService.get('/api/dashboard'),
  orders: () => apiService.get('/api/orders'),
  inbox: () => apiService.get('/api/inbox'),
  recommendations: () => apiService.get('/api/recommendations'),
  chat: (message: string, conversationId?: string) =>
    apiService.post('/api/chat', { message, conversationId }),
  markAsRead: (messageId: string) =>
    apiService.put(`/api/inbox/${messageId}/read`, {})
};
