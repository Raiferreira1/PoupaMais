// src/views/Register.jsx
import { useState, useEffect } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FormData antes do envio:", formData);

    // Validações
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

    setLoading(true);
    setMessage(null);

    // prepare body com as chaves que o backend espera
    const body = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };
    console.log("Body enviado ao backend:", body);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        // se for e-mail duplicado, vai ter data.erro === 'E-mail já cadastrado.'
        if (data.erro) {
          setMessage(data.erro);
        } else {
          setMessage("Erro no cadastro.");
        }
        setSuccess(false);
      } else {
        setSuccess(true);
        setMessage("Usuário cadastrado com sucesso!");
        // limpa o formulário após 2s
        setTimeout(() => {
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          setMessage(null);
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setSuccess(false);
      setMessage("Erro de rede, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100"> <form
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
      disabled={loading || success}
      className={`w-full py-2 font-semibold rounded-md transition 
        ${loading || success
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"}`}
    >
      {loading
        ? "Cadastrando..."
        : success
          ? "Cadastrado!"
          : "Cadastrar"}
    </button>

    {message && (
      <p className={`text-center text-sm ${success ? "text-green-600" : "text-red-600"}`}>
        {message}
      </p>
    )}
  </form></div>
   
  );
}

export default Register;
