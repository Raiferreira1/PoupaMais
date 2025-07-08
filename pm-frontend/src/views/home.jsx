import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAnaliseGastos } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [analise, setAnalise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('1');

  const fetchAnalise = async (periodo = '1') => {
    setLoading(true);
    setAnalise(null);
    console.log('Frontend: Buscando análise para período:', periodo);
    try {
      const data = await getAnaliseGastos(periodo);
      console.log('Frontend: Dados recebidos:', data);
      setAnalise(data);
    } catch (e) {
      console.error('Frontend: Erro ao buscar análise:', e);
      setAnalise(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('Frontend: useEffect executado com período:', periodoSelecionado);
    fetchAnalise(periodoSelecionado);
  }, [periodoSelecionado]);

  const handlePeriodoChange = (event) => {
    const novoPeriodo = event.target.value;
    console.log('Frontend: Período alterado para:', novoPeriodo);
    setPeriodoSelecionado(novoPeriodo);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Dashboard Financeiro
      </h1>

      {/* Bloco de análise de gastos IA */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Análise Inteligente de Gastos</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Debug: {periodoSelecionado}</span>
            <select
              value={periodoSelecionado}
              onChange={handlePeriodoChange}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
            >
              <option value="1">📅 Mês atual</option>
              <option value="3">📅 Últimos 3 meses</option>
              <option value="6">📅 Últimos 6 meses</option>
              <option value="12">📅 Últimos 12 meses</option>
              <option value="0">📅 Todas as transações</option>
            </select>
            <button
              onClick={() => fetchAnalise(periodoSelecionado + '&exato=true')}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              title="Mostrar apenas o período exato, sem expansão automática"
            >
              🎯 Exato
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-600">Carregando análise para período {periodoSelecionado}...</span>
          </div>
        )}
        
        {analise && (
          <div className="space-y-6">
            {/* Período analisado */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">📊</span>
                <span className="text-sm font-medium text-gray-700">
                  <b>Período analisado:</b> {analise.periodo_analisado}
                  {analise.total_transacoes_analisadas && (
                    <span className="ml-2 text-blue-600">({analise.total_transacoes_analisadas} transações)</span>
                  )}
                </span>
              </div>
            </div>

            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analise.maior_receita && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600">💰</span>
                    <h3 className="font-semibold text-green-800">Maior Receita</h3>
                  </div>
                  <p className="text-lg font-bold text-green-700">{analise.maior_receita}</p>
                  <p className="text-sm text-green-600">R$ {analise.maior_receita_valor?.toFixed(2) || '0.00'}</p>
                </div>
              )}
              
              {analise.maior_despesa && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-red-600">💸</span>
                    <h3 className="font-semibold text-red-800">Maior Despesa</h3>
                  </div>
                  <p className="text-lg font-bold text-red-700">{analise.maior_despesa}</p>
                  <p className="text-sm text-red-600">R$ {analise.maior_despesa_valor?.toFixed(2) || '0.00'}</p>
                </div>
              )}
              
              {analise.total_receitas > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-emerald-600">📈</span>
                    <h3 className="font-semibold text-emerald-800">Total Receitas</h3>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">R$ {analise.total_receitas.toFixed(2)}</p>
                </div>
              )}
              
              {analise.total_despesas > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-orange-600">📉</span>
                    <h3 className="font-semibold text-orange-800">Total Despesas</h3>
                  </div>
                  <p className="text-2xl font-bold text-orange-700">R$ {analise.total_despesas.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Principais despesas */}
            {analise.principais_despesas && analise.principais_despesas.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-600">📋</span>
                  <h3 className="text-lg font-semibold text-gray-800">Principais Despesas</h3>
                </div>
                <div className="space-y-3">
                  {analise.principais_despesas.map((despesa, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-sm font-bold">{index + 1}</span>
                          </div>
                          <span className="font-medium text-gray-800">{despesa.categoria}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">R$ {despesa.valor.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{despesa.percentual.toFixed(1)}% das despesas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sugestão */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-600 text-xl">💡</span>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Sugestão da IA</h3>
                  <p className="text-gray-700 leading-relaxed">{analise.sugestao}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !analise && (
          <div className="text-center py-8">
            <span className="text-red-500 text-lg">❌ Não foi possível obter a análise.</span>
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📂</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800 mb-1">Gerenciar Categorias</h3>
              <p className="text-sm text-blue-600">Organize suas categorias de gastos</p>
            </div>
            <button
              onClick={() => navigate('/categorias')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Acessar →
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-1">Gerenciar Transações</h3>
              <p className="text-sm text-green-600">Visualize e edite suas transações</p>
            </div>
            <button
              onClick={() => navigate('/transacoes')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Acessar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
