
import { Routes, Route } from 'react-router-dom';
import Login from './views/login';
import Register from './views/register';
import Home from './views/home'; // ✅ importa a página home
import Transacoes from './views/transacoes';
import Categorias from './views/categoria';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} /> {/* ✅ adiciona a rota da Home */}
      <Route path="/transacoes" element={<Transacoes />} />   {/* ✅ nova rota */}
      <Route path="/categoria" element={<Categorias />} />
    </Routes>
  );
}

export default App;
