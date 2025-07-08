// Instância do axios para requisições HTTP ao backend
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // URL base do backend Django
});

export default api;

export async function getAnaliseGastos(periodo = '1') {
  const url = `/api/ia/analise-gastos/?periodo=${periodo}`;
  console.log('API: URL construída:', url);
  const response = await api.get(url);
  console.log('API: Resposta recebida:', response.data);
  return response.data;
}
