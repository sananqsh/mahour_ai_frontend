import { fetchWithAuth } from "../utils/jwt";

const API_BASE_URL = 'http://localhost:8000';

const apiService = {
  get: async (endpoint: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
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
      const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
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
  dashboard: () => apiService.get('/api/v1/dashboard'),
  orders: () => apiService.get('/api/v1/orders'),
  inbox: () => apiService.get('/api/v1/inbox'),
  recommendations: () => apiService.get('/api/v1/recommendations'),
  chat: (message: string, conversation_id?: string) =>
    apiService.post('/api/v1/chat', { message, conversation_id }),
  markAsRead: (messageId: string) =>
    apiService.put(`/api/v1/inbox/${messageId}/read`, {})
};
