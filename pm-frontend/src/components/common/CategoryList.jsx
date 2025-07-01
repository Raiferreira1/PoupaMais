import { COLORS } from '../../utils/colors';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cor</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className="h-4 w-4 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                  style={{
                    backgroundColor: category.type === 'income' ? COLORS.success.LIGHT : COLORS.danger.LIGHT,
                    color: category.type === 'income' ? COLORS.success.DEFAULT : COLORS.danger.DEFAULT,
                  }}
                >
                  {category.type === 'income' ? 'Receita' : 'Despesa'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className="h-6 w-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="ml-2 text-sm text-gray-500">{category.color}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(category)}
                  className="text-green-600 hover:text-green-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList; 