// src/views/home.jsx
import React from "react";

function Home() {
  console.log("Componente Home renderizado"); // Ajuda no debug
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-gray-800">Bem-vindo à Home!</h1>
    </div>
  );
}

export default Home;
