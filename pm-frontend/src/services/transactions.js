const API_URL = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Token não encontrado');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

const transactionService = {
  getTransactions: async () => {
    try {
      console.log('Fetching transactions...');
      const response = await fetch(`${API_URL}/transacoes/`, {
        headers: getHeaders()
      });
      console.log('Transactions response:', response);
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.detail || 'Erro ao buscar transações');
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          throw new Error('Erro ao buscar transações: Resposta inválida do servidor');
        }
      }
      
      const data = await response.json();
      console.log('Raw transactions data:', data);
      
      // Formatar os dados para garantir tipos corretos
      const formattedData = data.map(transaction => ({
        id: transaction.id,
        description: transaction.titulo || '',
        amount: parseFloat(transaction.valor) || 0,
        date: transaction.data || '',
        category: transaction.categoria || null,
        type: transaction.tipo || 'expense'
      }));
      
      console.log('Formatted transactions:', formattedData);
      return formattedData;
    } catch (error) {
      console.error('Error in getTransactions:', error);
      throw error;
    }
  },

  createTransaction: async (transactionData) => {
    try {
      // Validar os dados antes de enviar
      if (!transactionData.description) {
        throw new Error('Descrição é obrigatória');
      }
      if (!transactionData.amount) {
        throw new Error('Valor é obrigatório');
      }
      if (!transactionData.date) {
        throw new Error('Data é obrigatória');
      }
      if (!transactionData.category) {
        throw new Error('Categoria é obrigatória');
      }

      // Garantir que os valores são números válidos
      const amount = parseFloat(transactionData.amount);
      if (isNaN(amount)) {
        throw new Error('Valor inválido');
      }

      const categoryId = parseInt(transactionData.category);
      if (isNaN(categoryId)) {
        throw new Error('Categoria inválida');
      }

      // Formatar os dados para a API
      const formattedData = {
        titulo: transactionData.description.trim(),
        valor: amount,
        data: transactionData.date,
        categoria: categoryId
      };

      console.log('Creating transaction with formatted data:', formattedData);
      console.log('Request URL:', `${API_URL}/transacoes/`);
      console.log('Request headers:', getHeaders());
      
      const response = await fetch(`${API_URL}/transacoes/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formattedData)
      });
      
      console.log('Create transaction response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Resposta inválida do servidor');
      }
      
      if (!response.ok) {
        console.error('Error response data:', responseData);
        // Mostrar mensagens de erro específicas
        const errorMessages = [];
        if (responseData.titulo) errorMessages.push(`Título: ${responseData.titulo.join(', ')}`);
        if (responseData.valor) errorMessages.push(`Valor: ${responseData.valor.join(', ')}`);
        if (responseData.data) errorMessages.push(`Data: ${responseData.data.join(', ')}`);
        if (responseData.categoria) errorMessages.push(`Categoria: ${responseData.categoria.join(', ')}`);
        throw new Error(errorMessages.join('\n') || 'Erro ao criar transação');
      }
      
      // Formatar a resposta para manter consistência
      return {
        id: responseData.id,
        description: responseData.titulo,
        amount: parseFloat(responseData.valor),
        date: responseData.data,
        category: responseData.categoria,
        type: responseData.tipo || 'expense'
      };
    } catch (error) {
      console.error('Error in createTransaction:', error);
      throw error;
    }
  },

  updateTransaction: async (id, transactionData) => {
    try {
      // Validar os dados antes de enviar
      if (!transactionData.description) {
        throw new Error('Descrição é obrigatória');
      }
      if (!transactionData.amount) {
        throw new Error('Valor é obrigatório');
      }
      if (!transactionData.date) {
        throw new Error('Data é obrigatória');
      }
      if (!transactionData.category) {
        throw new Error('Categoria é obrigatória');
      }

      // Garantir que os valores são números válidos
      const amount = parseFloat(transactionData.amount);
      if (isNaN(amount)) {
        throw new Error('Valor inválido');
      }

      const categoryId = parseInt(transactionData.category);
      if (isNaN(categoryId)) {
        throw new Error('Categoria inválida');
      }

      // Formatar os dados para a API
      const formattedData = {
        titulo: transactionData.description.trim(),
        valor: amount,
        data: transactionData.date,
        categoria: categoryId
      };

      console.log('Updating transaction:', id, formattedData);
      const response = await fetch(`${API_URL}/transacoes/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(formattedData)
      });
      
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Resposta inválida do servidor');
      }
      
      if (!response.ok) {
        console.error('Error response data:', responseData);
        // Mostrar mensagens de erro específicas
        const errorMessages = [];
        if (responseData.titulo) errorMessages.push(`Título: ${responseData.titulo.join(', ')}`);
        if (responseData.valor) errorMessages.push(`Valor: ${responseData.valor.join(', ')}`);
        if (responseData.data) errorMessages.push(`Data: ${responseData.data.join(', ')}`);
        if (responseData.categoria) errorMessages.push(`Categoria: ${responseData.categoria.join(', ')}`);
        throw new Error(errorMessages.join('\n') || 'Erro ao atualizar transação');
      }
      
      // Formatar a resposta para manter consistência
      return {
        id: responseData.id,
        description: responseData.titulo,
        amount: parseFloat(responseData.valor),
        date: responseData.data,
        category: responseData.categoria,
        type: responseData.tipo || 'expense'
      };
    } catch (error) {
      console.error('Error in updateTransaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      console.log('Deleting transaction:', id);
      const response = await fetch(`${API_URL}/transacoes/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      console.log('Delete transaction response:', response);
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.detail || 'Erro ao deletar transação');
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          throw new Error('Erro ao deletar transação: Resposta inválida do servidor');
        }
      }
    } catch (error) {
      console.error('Error in deleteTransaction:', error);
      throw error;
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