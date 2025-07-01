// Serviço para operações de categorias (CRUD) com o backend
const API_URL = 'http://127.0.0.1:8000/api';

// Gera headers de autenticação para requisições
const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Token não encontrado');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const categoryService = {
  // Busca todas as categorias
  getCategories: async () => {
    try {
      console.log('Fetching categories...');
      const token = localStorage.getItem('access_token');
      console.log('Token:', token);
      
      const response = await fetch(`${API_URL}/categorias/`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      console.log('Categories response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Erro ao buscar categorias');
      }
      
      const data = await response.json();
      console.log('Raw categories data:', data);
      
      // Formatar os dados para garantir tipos corretos
      const formattedData = data.map(category => {
        // Lista de categorias que são receitas
        const incomeCategories = ['salario', 'salário', 'receita', 'income', 'receitas'];
        
        // Verificar se o nome da categoria indica que é uma receita
        const isIncome = incomeCategories.some(incomeType => 
          category.nome.toLowerCase().includes(incomeType) || 
          category.tipo.toLowerCase().includes(incomeType)
        );
        
        return {
          id: category.id,
          name: category.nome || '',
          type: isIncome ? 'income' : 'expense',
          color: category.cor || '#000000'
        };
      });
      
      console.log('Formatted categories:', formattedData);
      return formattedData;
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  },

  // Cria uma nova categoria
  createCategory: async (categoryData) => {
    try {
      console.log('Creating category with data:', categoryData);
      const response = await fetch(`${API_URL}/categorias/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          nome: categoryData.name,
          tipo: categoryData.type === 'income' ? 'receita' : 'despesa',
          cor: categoryData.color
        })
      });
      
      console.log('Create category response:', response);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Erro ao criar categoria');
      }
      
      const data = await response.json();
      console.log('Created category:', data);
      
      // Formatar a resposta para manter consistência
      return {
        id: data.id,
        name: data.nome,
        type: data.tipo === 'receita' ? 'income' : 'expense',
        color: data.cor
      };
    } catch (error) {
      console.error('Error in createCategory:', error);
      throw error;
    }
  },

  // Atualiza uma categoria existente
  updateCategory: async (id, categoryData) => {
    try {
      console.log('Updating category:', id, categoryData);
      const response = await fetch(`${API_URL}/categorias/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          nome: categoryData.name,
          tipo: categoryData.type === 'income' ? 'receita' : 'despesa',
          cor: categoryData.color
        })
      });
      
      console.log('Update category response:', response);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Erro ao atualizar categoria');
      }
      
      const data = await response.json();
      console.log('Updated category:', data);
      
      // Formatar a resposta para manter consistência
      return {
        id: data.id,
        name: data.nome,
        type: data.tipo === 'receita' ? 'income' : 'expense',
        color: data.cor
      };
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  },

  // Remove uma categoria
  deleteCategory: async (id) => {
    try {
      console.log('Deleting category:', id);
      const response = await fetch(`${API_URL}/categorias/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      console.log('Delete category response:', response);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Erro ao deletar categoria');
      }
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  }
};

export default categoryService; 