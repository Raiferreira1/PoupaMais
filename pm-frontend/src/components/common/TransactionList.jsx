import PropTypes from 'prop-types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { COLORS } from '../../utils/colors';

const TransactionList = ({ transactions, categories, onEdit, onDelete }) => {
  const getCategoryName = (categoria) => {
    if (!categoria) return 'Sem categoria';
    // Se categoria é um objeto com dados completos (do backend)
    if (typeof categoria === 'object' && categoria !== null) {
      return categoria.nome || 'Sem categoria';
    }
    // Se categoria é apenas um ID (fallback)
    const category = categories.find(cat => cat.id === categoria);
    return category ? category.name : 'Sem categoria';
  };

  const getCategoryColor = (categoria) => {
    if (!categoria) return COLORS.gray.DEFAULT;
    // Se categoria é um objeto com dados completos (do backend)
    if (typeof categoria === 'object' && categoria !== null) {
      // Usar cor padrão baseada no tipo
      return categoria.tipo === 'Receita' ? COLORS.success.DEFAULT : COLORS.danger.DEFAULT;
    }
    // Se categoria é apenas um ID (fallback)
    const category = categories.find(cat => cat.id === categoria);
    return category ? category.color : COLORS.gray.DEFAULT;
  };

  const getCategoryType = (categoria) => {
    if (!categoria) return 'expense';
    // Se categoria é um objeto com dados completos (do backend)
    if (typeof categoria === 'object' && categoria !== null) {
      return categoria.tipo === 'Receita' ? 'income' : 'expense';
    }
    // Se categoria é apenas um ID (fallback)
    const category = categories.find(cat => cat.id === categoria);
    return category ? category.type : 'expense';
  };

  const isIncomeCategory = (categoria) => {
    if (!categoria) return false;
    // Se categoria é um objeto com dados completos (do backend)
    if (typeof categoria === 'object' && categoria !== null) {
      return categoria.tipo === 'Receita';
    }
    // Se categoria é apenas um ID (fallback)
    const category = categories.find((cat) => cat.id.toString() === categoria.toString());
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
            const categoryColor = getCategoryColor(transaction.categoria);
            const isIncome = Number(transaction.valor) > 0;
            return (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.data)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${categoryColor}20`,
                      color: categoryColor,
                    }}
                  >
                    {getCategoryName(transaction.categoria)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: isIncome ? COLORS.success.DEFAULT : COLORS.danger.DEFAULT }}>
                  {formatCurrency(Number(transaction.valor))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(transaction)}
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
      titulo: PropTypes.string.isRequired,
      valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      data: PropTypes.string.isRequired,
      categoria: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          nome: PropTypes.string,
          tipo: PropTypes.string,
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