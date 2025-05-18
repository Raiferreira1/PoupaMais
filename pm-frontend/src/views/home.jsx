// src/views/home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Dashboard Financeiro
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => navigate("/categoria")}
          className="px-8 py-4 bg-white shadow-md rounded-2xl text-lg font-semibold text-green-700 hover:bg-green-200 transition-all"
        >
          Gerenciar Categorias
        </button>

        <button
          onClick={() => navigate("/transacoes")}
          className="px-8 py-4 bg-white shadow-md rounded-2xl text-lg font-semibold text-green-700 hover:bg-green-200 transition-all"
        >
          Gerenciar Transações
        </button>
      </div>
    </div>
  );
}

export default Home;
