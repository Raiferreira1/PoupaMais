import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // A URL do seu backend Django
});

export default api;
