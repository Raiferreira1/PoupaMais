"use client"

import React, { useState, useEffect } from 'react';
import useTransactions from '../hooks/useTransactions';
import useCategories from '../hooks/useCategories';
import TransactionForm from '../components/forms/TransactionForm';
import TransactionList from '../components/common/TransactionList';
import TransactionFilter from '../components/filters/TransactionFilter';
import { formatCurrency } from '../utils/formatters';
import ConfirmModal from '../components/common/ConfirmModal';
import Alert from '../components/common/Alert';
import { COLORS } from '../utils/colors';

const Transacoes = () => {
  const { transactions, loading, error, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    categoryId: ''
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSubmit = async (transactionData) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, transactionData);
        setMessage('Transação atualizada com sucesso!');
      } else {
        await createTransaction(transactionData);
        setMessage('Transação criada com sucesso!');
      }
      setSuccess(true);
      setIsModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setMessage(error.message || 'Erro ao salvar transação');
      setSuccess(false);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(selectedTransaction.id);
      setMessage('Transação excluída com sucesso!');
      setSuccess(true);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setMessage(error.message);
      setSuccess(false);
    }
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.data);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
    const matchesDate = (!startDate || transactionDate >= startDate) && 
                       (!endDate || transactionDate <= endDate);
    
    const matchesType = !filters.type || 
                       (filters.type === 'income' && Number(transaction.valor) > 0) ||
                       (filters.type === 'expense' && Number(transaction.valor) < 0);
    
    const matchesCategory = !filters.categoryId || String(transaction.categoria) === String(filters.categoryId);
    
    return matchesDate && matchesType && matchesCategory;
  });

  const totalIncome = filteredTransactions
    .filter(t => Number(t.valor) > 0)
    .reduce((sum, t) => sum + Number(t.valor), 0);

  const totalExpense = filteredTransactions
    .filter(t => Number(t.valor) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.valor)), 0);

  const balance = totalIncome - totalExpense;

  if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <button
          onClick={() => {
            setSelectedTransaction(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Nova Transação
          </button>
        </div>

      {message && (
        <Alert
          message={message}
          type={success ? 'success' : 'error'}
          onClose={() => setMessage('')}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Receitas</h3>
          <p className="text-2xl font-bold" style={{ color: COLORS.success.DEFAULT }}>
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Despesas</h3>
          <p className="text-2xl font-bold" style={{ color: COLORS.danger.DEFAULT }}>
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Saldo</h3>
          <p className="text-2xl font-bold" style={{ color: balance >= 0 ? COLORS.success.DEFAULT : COLORS.danger.DEFAULT }}>
            {formatCurrency(balance)}
          </p>
              </div>
                </div>

      <TransactionFilter filters={filters} onFilterChange={handleFilterChange} categories={categories} />
      
      <TransactionList
        transactions={filteredTransactions}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedTransaction ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <TransactionForm
              onSubmit={handleSubmit}
              categories={categories}
              initialData={selectedTransaction}
            />
                <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTransaction(null);
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
          setSelectedTransaction(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta transação?"
      />
    </div>
  );
};

export default Transacoes;
