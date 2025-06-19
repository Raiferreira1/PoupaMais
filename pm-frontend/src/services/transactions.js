const API_URL = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const transactionService = {
  async getTransactions() {
    const response = await fetch(`${API_URL}/transacoes/`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar transações');
    }

    return response.json();
  },

  async createTransaction(transactionData) {
    const response = await fetch(`${API_URL}/transacoes/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao criar transação');
    }

    return response.json();
  },

  async updateTransaction(id, transactionData) {
    const response = await fetch(`${API_URL}/transacoes/${id}/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao atualizar transação');
    }

    return response.json();
  },

  async deleteTransaction(id) {
    const response = await fetch(`${API_URL}/transacoes/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar transação');
    }
  },

  async getCategories() {
    const response = await fetch(`${API_URL}/categories/`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }

    return response.json();
  },

  async createCategory(categoryData) {
    const response = await fetch(`${API_URL}/categories/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao criar categoria');
    }

    return response.json();
  },

  async updateCategory(id, categoryData) {
    const response = await fetch(`${API_URL}/categories/${id}/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao atualizar categoria');
    }

    return response.json();
  },

  async deleteCategory(id) {
    const response = await fetch(`${API_URL}/categories/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar categoria');
    }
  },
};

export default transactionService; 