import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({ nome: '', descricao: '', tipo: '' });
  const [editarId, setEditarId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  // Limpa mensagens de sucesso após 3 segundos
  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(() => {
        setSucesso(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sucesso]);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/categorias/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategorias(response.data);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setErro('Erro ao carregar categorias. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nome, tipo } = formData;
    if (!nome.trim() || !tipo) {
      setErro('Os campos Nome e Tipo são obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      setErro(null);
      const token = localStorage.getItem('access_token');
      
      if (editarId) {
        await axios.put(`http://127.0.0.1:8000/api/categorias/${editarId}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSucesso('Categoria atualizada com sucesso!');
        setEditarId(null);
      } else {
        console.log('Enviando categoria:', formData);
        await axios.post('http://127.0.0.1:8000/api/categorias/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSucesso('Categoria adicionada com sucesso!');
      }
      
      setFormData({ nome: '', descricao: '', tipo: '' });
      carregarCategorias();
      
    } catch (error) {
        console.error('Erro detalhado:', error.response?.data || error.message);

      console.error('Erro ao salvar categoria:', error);
      setErro(error.response?.data?.detail || 'Erro ao salvar categoria. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (categoria) => {
    setCategoriaToDelete(categoria);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoriaToDelete) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/categorias/${categoriaToDelete.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSucesso('Categoria excluída com sucesso!');
      setShowDeleteModal(false);
      setCategoriaToDelete(null);
      carregarCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setErro(error.response?.data?.detail || 'Erro ao excluir categoria. Esta categoria pode estar sendo usada em transações.');
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoria) => {
    setFormData({
      nome: categoria.nome || '',
      descricao: categoria.descricao || '',
      tipo: categoria.tipo || '',
    });
    setEditarId(categoria.id);
    setErro(null); // Limpa erros anteriores
    
    // Rola a página para o formulário
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const cancelarEdicao = () => {
    setFormData({ nome: '', descricao: '', tipo: '' });
    setEditarId(null);
    setErro(null);
  };

  // Filtra as categorias com base no termo de busca
  const categoriasFiltradas = categorias.filter(categoria => 
    categoria.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    (categoria.descricao && categoria.descricao.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerenciar Categorias</h2>
        
        {/* Formulário */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">
            {editarId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome da categoria"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Receita">Receita</option>
                  <option value="Despesa">Despesa</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição da categoria (opcional)"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2 justify-end">
              {editarId && (
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-md ${
                  editarId 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={loading}
              >
                {loading ? 'Salvando...' : editarId ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>

        {/* Mensagens de feedback */}
        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Erro</p>
            <p>{erro}</p>
          </div>
        )}
        
        {sucesso && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">Sucesso</p>
            <p>{sucesso}</p>
          </div>
        )}

        {/* Filtro de busca */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar categorias..."
              className="w-full sm:w-80 px-4 py-2 pl-10 border rounded-md"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Lista de categorias */}
        {loading && !categorias.length ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-600">Carregando categorias...</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoriasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      {filtro 
                        ? 'Nenhuma categoria encontrada para esta busca.' 
                        : 'Nenhuma categoria cadastrada.'}
                    </td>
                  </tr>
                ) : (
                  categoriasFiltradas.map((categoria) => (
                    <tr key={categoria.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {categoria.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          categoria.tipo === 'Receita' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {categoria.tipo === 'Receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {categoria.descricao || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="text-yellow-600 hover:text-yellow-800 mr-3"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(categoria)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja excluir a categoria "{categoriaToDelete?.nome}"? 
              Esta ação não pode ser desfeita e pode afetar transações associadas a esta categoria.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categorias;