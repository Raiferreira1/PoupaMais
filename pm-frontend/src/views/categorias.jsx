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
        <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600"
        >
          Adicionar
        </button>
      </div>
      {message && (
        <Alert
          message={message}
          type={success ? 'success' : 'error'}
          onClose={() => setMessage('')}
        />
      )}
      <CategoryList
        categories={categories}
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