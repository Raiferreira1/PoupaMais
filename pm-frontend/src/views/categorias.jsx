import React, { useState } from 'react';
import useCategories from '../hooks/useCategories';
import CategoryForm from '../components/forms/CategoryForm';
import CategoryList from '../components/common/CategoryList';
import ConfirmModal from '../components/common/ConfirmModal';
import Alert from '../components/common/Alert';

const Categorias = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'padrao', 'custom'
  
  // Separar categorias por tipo
  const categoriasPadrao = categories.filter(cat => cat.padrao);
  const categoriasCustom = categories.filter(cat => !cat.padrao);
  
  // Categorias filtradas baseadas no filtro selecionado
  const categoriasFiltradas = filter === 'all' ? categories : 
                             filter === 'padrao' ? categoriasPadrao : 
                             categoriasCustom;

  const handleSubmit = async (categoryData) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, categoryData);
        setMessage('Categoria atualizada com sucesso!');
      } else {
        await createCategory(categoryData);
        setMessage('Categoria criada com sucesso!');
      }
      setSuccess(true);
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      setMessage(error.message || 'Erro ao salvar categoria');
      setSuccess(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedCategory.id);
      setMessage('Categoria excluída com sucesso!');
      setSuccess(true);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      setMessage(error.message);
      setSuccess(false);
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie suas categorias de transações financeiras
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600 transition-colors"
        >
          ➕ Adicionar Categoria
        </button>
      </div>
      
      {/* Informações sobre categorias padrão */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">
              Sobre as Categorias do Sistema
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <span className="font-medium">🔒 Categorias Padrão:</span> São criadas automaticamente pelo sistema e não podem ser editadas ou excluídas. 
                Elas garantem que você sempre tenha as categorias essenciais para organizar suas finanças.
              </p>
              <p>
                <span className="font-medium">✏️ Categorias Personalizadas:</span> Você pode criar, editar e excluir suas próprias categorias 
                para personalizar ainda mais sua organização financeira.
              </p>
            </div>
          </div>
        </div>
      </div>
      {message && (
        <Alert
          message={message}
          type={success ? 'success' : 'error'}
          onClose={() => setMessage('')}
        />
      )}
      
      {/* Filtros */}
      <div className="mb-4 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Filtrar:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Todas ({categories.length})
          </button>
          <button
            onClick={() => setFilter('padrao')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'padrao' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔒 Padrão ({categoriasPadrao.length})
          </button>
          <button
            onClick={() => setFilter('custom')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'custom' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✏️ Personalizadas ({categoriasCustom.length})
          </button>
        </div>
      </div>
      
      <CategoryList
        categories={categoriasFiltradas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <CategoryForm
              onSubmit={handleSubmit}
              initialData={selectedCategory}
            />
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedCategory(null);
              }}
              className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta categoria?"
      />
    </div>
  );
};

export default Categorias; 