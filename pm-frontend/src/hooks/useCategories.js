import { useState, useCallback, useEffect } from 'react';
import categoryService from '../services/categories';

// Hook customizado para gerenciar categorias financeiras
const useCategories = () => {
  // Estado das categorias, carregamento e erro
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca todas as categorias do backend
  const fetchCategories = useCallback(async () => {
    try {
      console.log('Fetching categories in useCategories hook...');
      const token = localStorage.getItem('access_token');
      console.log('Token:', token);
      
      setLoading(true);
      const data = await categoryService.getCategories();
      console.log('Categories data received:', data);
      
      if (!Array.isArray(data)) {
        console.error('Invalid categories data:', data);
        throw new Error('Dados de categorias inválidos');
      }
      
      // Formata as categorias para garantir tipos consistentes
      const formattedCategories = data.map(category => ({
        ...category,
        type: category.type === 'receita' || category.type === 'income' ? 'income' : 'expense',
        name: category.name || category.titulo || 'Sem nome'
      }));
      
      console.log('Formatted categories:', formattedCategories);
      setCategories(formattedCategories);
      setError(null);
    } catch (err) {
      console.error('Error in useCategories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega categorias ao montar o componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Cria uma nova categoria
  const createCategory = useCallback(async (categoryData) => {
    try {
      setLoading(true);
      const newCategory = await categoryService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      setError(null);
      return newCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza uma categoria existente
  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      setLoading(true);
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
      setError(null);
      return updatedCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove uma categoria
  const deleteCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Retorna o estado e as funções do hook
  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};

export default useCategories; 