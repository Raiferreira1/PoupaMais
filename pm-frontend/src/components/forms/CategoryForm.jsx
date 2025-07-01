import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/buttons.css';

// Formulário para criar ou editar uma categoria
const CategoryForm = ({ onSubmit, initialData = {}, loading = false }) => {
  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#000000'
  });

  // Preenche o formulário ao editar uma categoria existente
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        color: initialData.color || '#000000'
      });
    }
  }, [initialData]);

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envia o formulário para o callback do pai
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {/* Campo tipo */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
      </div>
      {/* Campo cor */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Cor
        </label>
        <div className="mt-1 flex items-center space-x-2">
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="h-8 w-8 rounded-md border border-gray-300"
          />
          <input
            type="text"
            value={formData.color}
            onChange={handleChange}
            name="color"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      {/* Botão de envio */}
      <button
        type="submit"
        className="category-submit-button"
        disabled={loading}
      >
        {initialData ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
};

CategoryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  loading: PropTypes.bool,
};

export default CategoryForm; 