import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Layout principal do dashboard, com navbar e área de conteúdo
const DashboardLayout = ({ children }) => {
  // Obtém funções e dados do contexto de autenticação
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Função para logout e redirecionamento
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar superior */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo e nome do app */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/home" className="text-xl font-bold text-green-600">
                  PoupaMais
                </Link>
              </div>
              {/* Links de navegação */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/home"
                  className="border-transparent text-gray-500 hover:border-green-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/transacoes"
                  className="border-transparent text-gray-500 hover:border-green-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Transações
                </Link>
                <Link
                  to="/categoria"
                  className="border-transparent text-gray-500 hover:border-green-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categorias
                </Link>
              </div>
            </div>
            {/* Usuário logado e botão de sair */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Olá, {user?.userName || 'Usuário'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Conteúdo principal do dashboard */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 