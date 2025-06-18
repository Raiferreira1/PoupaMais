import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactions';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      console.log('Fetching transactions in useTransactions hook...');
      setLoading(true);
      setError(null);
      
      const data = await transactionService.getTransactions();
      console.log('Transactions data received:', data);
      
      if (!Array.isArray(data)) {
        console.error('Invalid transactions data:', data);
        throw new Error('Dados de transações inválidos');
      }
      
      setTransactions(data);
      return data;
    } catch (err) {
      console.error('Error in fetchTransactions:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('useTransactions effect running...'); // Debug log
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      console.log('Creating transaction in useTransactions hook:', transactionData);
      setLoading(true);
      setError(null);
      
      const newTransaction = await transactionService.createTransaction(transactionData);
      console.log('New transaction created:', newTransaction);
      
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (err) {
      console.error('Error in createTransaction:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      console.log('Updating transaction in useTransactions hook:', id, transactionData);
      setLoading(true);
      setError(null);
      
      const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
      console.log('Transaction updated:', updatedTransaction);
      
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      return updatedTransaction;
    } catch (err) {
      console.error('Error in updateTransaction:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      console.log('Deleting transaction in useTransactions hook:', id);
      setLoading(true);
      setError(null);
      
      await transactionService.deleteTransaction(id);
      console.log('Transaction deleted:', id);
      
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error in deleteTransaction:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
};

export default useTransactions; 