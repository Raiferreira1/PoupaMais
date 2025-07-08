import { COLORS } from '../../utils/colors';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cor</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr 
              key={category.id} 
              className={`${
                category.padrao 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 shadow-sm' 
                  : 'hover:bg-gray-50'
              } transition-all duration-200`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {category.padrao && (
                    <div className="mr-3 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-blue-600 text-sm">⭐</span>
                    </div>
                  )}
                  <div
                    className={`h-4 w-4 rounded-full mr-2 ${
                      category.padrao ? 'ring-2 ring-blue-200' : ''
                    }`}
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span className={category.padrao ? 'font-bold text-blue-900' : ''}>
                        {category.name}
                      </span>
                      {category.padrao && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full font-semibold shadow-sm">
                            🔒 SISTEMA
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Padrão
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.padrao ? 'shadow-sm' : ''
                  } ${
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
                {category.padrao ? (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
                      🔒 PROTEGIDA
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      Não editável
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      ✏️ EDITÁVEL
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      Personalizável
                    </span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className={`h-6 w-6 rounded-full border ${
                      category.padrao ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: category.color }}
                  />
                  <span className={`ml-2 text-sm ${
                    category.padrao ? 'text-blue-700 font-medium' : 'text-gray-500'
                  }`}>
                    {category.color}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {!category.padrao && (
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="px-3 py-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="px-3 py-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                )}
                {category.padrao && (
                  <div className="flex items-center justify-end">
                    <span className="text-blue-500 text-xs font-medium bg-blue-50 px-3 py-1 rounded-full">
                      🔒 Protegida pelo Sistema
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList; 