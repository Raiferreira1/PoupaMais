
// // src/App.js
// import React from "react";
// import Register from './views/register'; 

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <Register />
//     </div>
//   );
// }

// export default App;


// src/App.js
// src/App.jsx
// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/login';
import Register from './views/register';
import Home from './views/home'; // ✅ importa a página home

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} /> {/* ✅ adiciona a rota da Home */}
    </Routes>
  );
}

export default App;
