// src/views/Register.jsx
import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setSuccess(false);
      return setMessage("Preencha todos os campos.");
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setSuccess(false);
      return setMessage("E-mail inválido.");
    }

    if (formData.password !== formData.confirmPassword) {
      setSuccess(false);
      return setMessage("As senhas não coincidem.");
    }

    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no cadastro");

      setSuccess(true);
      setMessage("Usuário cadastrado com sucesso!");
    } catch (err) {
      setSuccess(false);
      setMessage(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Cadastro</h2>
      
      <input
        type="text"
        name="name"
        placeholder="Nome completo"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Senha"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar senha"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Cadastrar
      </button>

      {message && (
        <p className={`text-center text-sm ${success ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

export default Register;
