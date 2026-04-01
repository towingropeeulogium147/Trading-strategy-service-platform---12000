const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async getAllStrategies() {
    const response = await fetch(`${API_BASE_URL}/strategies`);
    if (!response.ok) throw new Error('Failed to fetch strategies');
    return response.json();
  },

  async getStrategyById(id: number) {
    const response = await fetch(`${API_BASE_URL}/strategies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch strategy');
    return response.json();
  },

  async createStrategy(strategy: any) {
    const response = await fetch(`${API_BASE_URL}/strategies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strategy),
    });
    if (!response.ok) throw new Error('Failed to create strategy');
    return response.json();
  },

  async signup(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    return response.json();
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(token: string, data: { name?: string; bio?: string; avatar_url?: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  async uploadAvatar(token: string, base64: string, mimeType: string) {
    const response = await fetch(`${API_BASE_URL}/auth/avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ base64, mimeType }),
    });
    if (!response.ok) throw new Error('Failed to upload avatar');
    return response.json();
  },

  async getAllDiscussions(token: string) {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch discussions');
    return response.json();
  },

  async getDiscussionById(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/discussions/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch discussion');
    return response.json();
  },

  async createDiscussion(token: string, data: { title: string; content: string; category: string }) {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create discussion');
    return response.json();
  },

  async createReply(token: string, discussionId: string, content: string) {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to post reply');
    return response.json();
  },

  async likeDiscussion(token: string, discussionId: string) {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to like discussion');
    return response.json();
  },

  async toggleFollow(token: string, userId: string) {
    const response = await fetch(`${API_BASE_URL}/follow/${userId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to toggle follow');
    return response.json();
  },

  async getFollowStatus(token: string, userId: string) {
    const response = await fetch(`${API_BASE_URL}/follow/${userId}/status`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get follow status');
    return response.json();
  },
};
