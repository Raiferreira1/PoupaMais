import React, { useState, useEffect } from 'react';
import useCategories from '../../hooks/useCategories';
import { parseCurrency } from '../../utils/formatters';
import { COLORS } from '../../utils/colors';

const TransactionForm = ({ onSubmit, initialData = null, categories = [] }) => {
  const { categories: categoriesData, loading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
    type: 'expense'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.titulo || '',
        amount: Math.abs(initialData.valor).toString() || '',
        date: initialData.data ? new Date(initialData.data).toISOString().split('T')[0] : '',
        category: initialData.categoria || '',
        type: Number(initialData.valor) > 0 ? 'income' : 'expense'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.description.trim()) {
      alert('Por favor, preencha a descrição');
      return;
    }
    if (!formData.amount) {
      alert('Por favor, preencha o valor');
      return;
    }
    if (!formData.date) {
      alert('Por favor, selecione a data');
      return;
    }
    if (!formData.category) {
      alert('Por favor, selecione uma categoria');
      return;
    }

    // Descobre o tipo da categoria
    const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category));
    const isReceita = selectedCategory && (selectedCategory.type === 'income' || selectedCategory.type === 'Receita');
    const amount = Math.abs(parseCurrency(formData.amount));
    const finalAmount = isReceita ? amount : -amount;

    onSubmit({
      titulo: formData.description.trim(),
      valor: finalAmount,
      data: formData.date,
      categoria: parseInt(formData.category),
      descricao: ''
    });
  };

  // Agrupa categorias por tipo
  const groupedCategories = React.useMemo(() => {
    if (!categoriesData) return { income: [], expense: [] };

    return categoriesData.reduce((acc, category) => {
      const type = category.type === 'income' ? 'income' : 'expense';
      acc[type].push(category);
      return acc;
    }, { income: [], expense: [] });
  }, [categoriesData]);

  if (categoriesLoading) {
    return <div>Carregando categorias...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Digite a descrição"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Valor
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">R$</span>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0,00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Selecione uma categoria</option>
          <optgroup label="Receitas" style={{ color: COLORS.success.DEFAULT }}>
            {groupedCategories.income.map(category => (
              <option 
                key={category.id} 
                value={category.id}
                style={{ color: category.color || COLORS.success.DEFAULT }}
              >
                {category.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Despesas" style={{ color: COLORS.danger.DEFAULT }}>
            {groupedCategories.expense.map(category => (
              <option 
                key={category.id} 
                value={category.id}
                style={{ color: category.color || COLORS.danger.DEFAULT }}
              >
                {category.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {initialData ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm; 