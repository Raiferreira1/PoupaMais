// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Alterar a importação para 'react-dom/client'
import App from "./App";
import './index.css'; // Certifique-se de que está importando o arquivo CSS


// Usar createRoot em vez de render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
