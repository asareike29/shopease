import api from './axiosConfig';

export const authService = {
  register: async (data: { full_name: string; email: string; password: string }) => {
    const response = await api.post('/api/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('shopease_token', response.data.data.token);
      return response.data.data.user;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    if (response.data.success) {
      localStorage.setItem('shopease_token', response.data.data.token);
      return response.data.data.user;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('shopease_token');
      localStorage.removeItem('shopease_user');
    }
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    if (response.data.success) {
      return response.data.data.user;
    }
    throw new Error('Failed to fetch user data');
  }
};
