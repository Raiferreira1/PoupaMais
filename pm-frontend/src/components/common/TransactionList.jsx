import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { COLORS } from '../../utils/colors';

const TransactionList = ({ transactions, categories, onEdit, onDelete }) => {
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Sem categoria';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  const getCategoryColor = (categoryId) => {
    if (!categoryId) return COLORS.gray.DEFAULT;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : COLORS.gray.DEFAULT;
  };

  const getCategoryType = (categoryId) => {
    if (!categoryId) return 'expense';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.type : 'expense';
  };

  const isIncomeCategory = (categoryId) => {
    if (!categoryId) return false;
    
    // Se categoryId for um objeto com name
    if (typeof categoryId === 'object' && categoryId !== null) {
      const name = categoryId.name?.toLowerCase() || '';
      return name.includes('receita') || name.includes('salário');
    }
    
    // Se categoryId for um número ou string
    const category = categories.find((cat) => 
      cat.id.toString() === categoryId.toString()
    );
    if (!category) return false;
    
    const name = category.name.toLowerCase();
    return name.includes('receita') || name.includes('salário');
  };

  if (!transactions.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => {
            const categoryType = getCategoryType(transaction.category);
            const categoryColor = getCategoryColor(transaction.category);
            const isIncome = categoryType === 'income';
            
            return (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${categoryColor}20`,
                      color: categoryColor
                    }}
                  >
                    {getCategoryName(transaction.category)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: isIncome ? COLORS.success.DEFAULT : COLORS.danger.DEFAULT }}>
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      date: PropTypes.string.isRequired,
      category: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string,
        }),
      ]),
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TransactionList; 