const API_URL = 'http://127.0.0.1:8000/api';

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Erro ao fazer login');
    }

    return data;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Erro ao fazer cadastro');
    }

    return data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService; 