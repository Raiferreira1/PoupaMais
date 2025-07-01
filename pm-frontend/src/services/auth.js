// Serviço de autenticação: login, registro, logout e token
const API_URL = 'http://127.0.0.1:8000/api';

export const authService = {
  // Realiza login e retorna tokens e dados do usuário
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

  // Realiza cadastro de novo usuário
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

  // Remove tokens do localStorage (logout)
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
  },

  // Retorna o token salvo
  getToken() {
    return localStorage.getItem('access_token');
  },

  // Verifica se está autenticado
  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService; 