"use client"

import { useState, useEffect } from "react"
import axios from "axios"

function Transacoes() {
  const [transacoes, setTransacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para modais
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [transacaoToDelete, setTransacaoToDelete] = useState(null)
  const [transacaoToEdit, setTransacaoToEdit] = useState(null)

  // Estados para formulário
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    valor: "",
    data: "",
    categoria: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchTransacoes()
    fetchCategorias()
  }, [])

  const fetchTransacoes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")
      const { data } = await axios.get("http://127.0.0.1:8000/api/transacoes/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTransacoes(data)
      setErro(null)
    } catch (error) {
      console.error("Erro ao carregar transações:", error)
      setErro("Erro ao carregar transações. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const { data } = await axios.get("http://127.0.0.1:8000/api/categorias/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategorias(data)
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    }
  }

  // Funções para manipulação de modais
  const handleDeleteClick = (transacao) => {
    setTransacaoToDelete(transacao)
    setShowDeleteModal(true)
  }

  const handleAddClick = () => {
    resetForm()
    setShowAddModal(true)
  }

  // Substitua a função handleEditClick atual por esta versão corrigida
  const handleEditClick = (transacao) => {
    setTransacaoToEdit(transacao)

    // Determinar o valor correto para categoria baseado na estrutura dos dados
    let categoriaValue = ""
    if (transacao.categoria) {
      // Se categoria for um objeto com id
      if (typeof transacao.categoria === "object" && transacao.categoria.id) {
        categoriaValue = transacao.categoria.id.toString()
      }
      // Se categoria for diretamente o id
      else if (typeof transacao.categoria === "number" || typeof transacao.categoria === "string") {
        categoriaValue = transacao.categoria.toString()
      }
    }

    setFormData({
      titulo: transacao.titulo || "",
      descricao: transacao.descricao || "",
      valor: transacao.valor.toString(),
      data: transacao.data,
      categoria: categoriaValue,
    })

    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      valor: "",
      data: formatDateForInput(new Date()),
      categoria: "",
    })
    setFormErrors({})
  }

  // Funções para manipulação de formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro do campo quando o usuário digita
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.titulo.trim()) errors.titulo = "O título é obrigatório"
    if (!formData.valor) errors.valor = "O valor é obrigatório"
    else if (isNaN(Number(formData.valor)) || Number(formData.valor) <= 0)
      errors.valor = "O valor deve ser um número positivo"
    if (!formData.data) errors.data = "A data é obrigatória"
    if (!formData.categoria) errors.categoria = "A categoria é obrigatória"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    setErro(null)
    setSuccessMessage("")

    try {
      const token = localStorage.getItem("access_token")
      const payload = {
        ...formData,
        valor: Number(formData.valor),
      }

      if (showAddModal) {
        await axios.post("http://127.0.0.1:8000/api/transacoes/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSuccessMessage("Transação adicionada com sucesso!")
      } else if (showEditModal && transacaoToEdit) {
        await axios.put(`http://127.0.0.1:8000/api/transacoes/${transacaoToEdit.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSuccessMessage("Transação atualizada com sucesso!")
      }

      // Recarregar transações e fechar modal após um breve delay
      setTimeout(() => {
        fetchTransacoes()
        closeModals()
      }, 1500)
    } catch (error) {
      console.error("Erro ao salvar transação:", error)
      setErro("Erro ao salvar a transação. Por favor, verifique os dados e tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!transacaoToDelete) return

    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")
      await axios.delete(`http://127.0.0.1:8000/api/transacoes/${transacaoToDelete.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTransacoes((prev) => prev.filter((t) => t.id !== transacaoToDelete.id))
      setShowDeleteModal(false)
      setTransacaoToDelete(null)
      setSuccessMessage("Transação excluída com sucesso!")

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Erro ao excluir transação:", error)
      setErro("Erro ao excluir transação. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const closeModals = () => {
    setShowDeleteModal(false)
    setShowAddModal(false)
    setShowEditModal(false)
    setTransacaoToDelete(null)
    setTransacaoToEdit(null)
    setErro(null)
    setSuccessMessage("")
  }

  // Funções utilitárias
  const filteredTransacoes = transacoes.filter(({ titulo = "", descricao = "", categoria = {} }) => {
    const termo = searchTerm.toLowerCase()
    return (
      titulo.toLowerCase().includes(termo) ||
      descricao.toLowerCase().includes(termo) ||
      (categoria && categoria.nome && categoria.nome.toLowerCase().includes(termo))
    )
  })

  const formatarValor = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)

  const formatarData = (dataString) => {
    const data = new Date(dataString)
    return isNaN(data.getTime()) ? dataString : data.toLocaleDateString("pt-BR")
  }

  const formatDateForInput = (date) => {
    if (!date) return ""
    if (typeof date === "string") {
      // Se já for uma string no formato YYYY-MM-DD, retorne-a
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
      date = new Date(date)
    }
    if (isNaN(date.getTime())) return ""

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Também precisamos corrigir a função isReceita para lidar com diferentes formatos
  const isReceita = (categoria) => {
    // Se categoria for undefined ou null
    if (!categoria) return false

    // Se categoria for um objeto com propriedade nome
    if (typeof categoria === "object" && categoria.nome) {
      const termo = categoria.nome.toLowerCase()
      return termo.includes("receita") || termo.includes("salário") || termo.includes("investimento")
    }

    // Se categoria for um ID, tentamos encontrar a categoria correspondente
    if (typeof categoria === "number" || typeof categoria === "string") {
      const categoriaObj = categorias.find((cat) => cat.id.toString() === categoria.toString())
      if (categoriaObj && categoriaObj.nome) {
        const termo = categoriaObj.nome.toLowerCase()
        return termo.includes("receita") || termo.includes("salário") || termo.includes("investimento")
      }
    }

    return false
  }

  // Função para obter o nome da categoria pelo ID
  const getCategoriaById = (id) => {
    const categoria = categorias.find((cat) => cat.id.toString() === id.toString())
    return categoria ? categoria.nome : "Categoria não encontrada"
  }

  // Função para verificar se uma categoria é do tipo receita
  const isCategoriaReceita = (categoriaId) => {
    const categoria = categorias.find((cat) => cat.id.toString() === categoriaId.toString())
    return categoria ? isReceita(categoria) : false
  }

  return (
    <div className="container mx-auto p-4">
      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Transações</h2>
            <p className="text-gray-600">Gerencie suas receitas e despesas</p>
          </div>
          <button
            onClick={handleAddClick}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mt-4 sm:mt-0"
          >
            Nova Transação
          </button>
        </div>

        <div className="mb-6 relative">
          <input
            type="search"
            placeholder="Buscar transações..."
            className="w-full sm:w-80 px-4 py-2 pl-10 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {loading && !transacoes.length ? (
          <p className="text-center text-gray-600 py-8">Carregando transações...</p>
        ) : erro && !transacoes.length ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{erro}</p>
            <button
              onClick={fetchTransacoes}
              className="mt-2 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Data", "Título", "Categoria", "Descrição", "Valor", "Ações"].map((col) => (
                    <th
                      key={col}
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${col === "Valor" ? "text-right" : col === "Ações" ? "text-center" : "text-left"}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransacoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? "Nenhuma transação encontrada para esta busca." : "Nenhuma transação cadastrada."}
                    </td>
                  </tr>
                ) : (
                  filteredTransacoes.map((transacao) => {
                    const receita = isReceita(transacao.categoria)
                    return (
                      <tr key={transacao.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatarData(transacao.data)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center">
                            <span className={`mr-1 ${receita ? "text-green-500" : "text-red-500"}`}>
                              {receita ? "↑" : "↓"}
                            </span>
                            {transacao.titulo}
                          </span>
                        </td>
                        {/* Corrigir a exibição da categoria na tabela */}
                        {/* Substitua a linha que renderiza a categoria na tabela por esta: */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${receita ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}
                          >
                            {(() => {
                              if (!transacao.categoria) return "-"

                              if (typeof transacao.categoria === "object" && transacao.categoria.nome) {
                                return transacao.categoria.nome
                              }

                              const categoriaObj = categorias.find(
                                (cat) => cat.id.toString() === transacao.categoria.toString(),
                              )
                              return categoriaObj ? categoriaObj.nome : "-"
                            })()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate text-gray-900">
                          {transacao.descricao || "-"}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm text-right ${receita ? "text-green-600" : "text-red-600"} font-medium`}
                        >
                          {formatarValor(transacao.valor)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditClick(transacao)}
                              className="text-yellow-600 hover:text-yellow-800"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteClick(transacao)}
                              className="text-red-600 hover:text-red-800"
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja excluir a transação "{transacaoToDelete?.titulo}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={closeModals} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
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

      {/* Modal de Adicionar/Editar Transação */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-4">{showAddModal ? "Nova Transação" : "Editar Transação"}</h3>

            {erro && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{erro}</div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.titulo ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Ex: Salário, Aluguel, etc."
                  />
                  {formErrors.titulo && <p className="mt-1 text-sm text-red-600">{formErrors.titulo}</p>}
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0.01"
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.valor ? "border-red-500" : "border-gray-300"}`}
                    placeholder="0,00"
                  />
                  {formErrors.valor && <p className="mt-1 text-sm text-red-600">{formErrors.valor}</p>}
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={formatDateForInput(formData.data)}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.data ? "border-red-500" : "border-gray-300"}`}
                  />
                  {formErrors.data && <p className="mt-1 text-sm text-red-600">{formErrors.data}</p>}
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.categoria ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoria && <p className="mt-1 text-sm text-red-600">{formErrors.categoria}</p>}
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Detalhes adicionais sobre a transação"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  disabled={submitting}
                >
                  {submitting ? "Salvando..." : showAddModal ? "Adicionar" : "Atualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transacoes
